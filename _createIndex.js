'use strict';

var argv = require('./argv');
var client = require('./_client');
var omitFields = require('./_omitFields');
var confirmReset = require('./_confirmReset');
var argv = require('./argv');

module.exports = function createIndex() {
  var indexTemplate = argv.indexPrefix + '*';
  var indexTemplateName = 'makelogs_index_template__' + argv.indexPrefix;

  var body = {
    ...(
      argv.indexTemplatesV1
        ? { template: indexTemplate }
        : { index_patterns: indexTemplate }
    ),
    settings: {
      index: {
        number_of_shards: argv.shards,
        number_of_replicas: argv.replicas,
      },
      analysis: {
        analyzer: {
          makelogs_url: {
            type: 'standard',
            tokenizer: 'uax_url_email',
            max_token_length: 1000
          }
        }
      }
    },
    mappings: {
      // properties
      properties: omitFields({
        '@timestamp': {
          type: 'date'
        },
        id: {
          type: 'integer',
          index: 'true',
        },
        clientip: {
          type: 'ip'
        },
        ip: {
          type: 'ip'
        },
        memory: {
          type: 'double'
        },
        referer: {
          type: 'keyword',
        },
        geo: {
          properties: {
            srcdest: {
              type: 'keyword',
            },
            dest: {
              type: 'keyword',
            },
            src: {
              type: 'keyword',
            },
            coordinates: {
              type: 'geo_point'
            }
          }
        },
        meta: {
          properties: {
            related: {
              type: 'text',
            },
            char: {
              type: 'keyword',
            },
            user: {
              properties: {
                firstname: {
                  type: 'text',
                },
                lastname: {
                  type: 'integer',
                  index: 'true'
                }
              }
            }
          }
        }
      }, true)
    }
  };

  if (argv.types) {
    body.mappings = {
      _doc: body.mappings
    }
  }

  return client.usable
  .then(async () => ({
    indices: await client.indices.exists({
      index: indexTemplate,
      allowNoIndices: false
    })
  }))
  .then(async function (exists) {
    async function clearExisting() {
      console.log('clearing existing "%s" index templates and indices', indexTemplate);
      const existingIndicesRsp = await client.indices.getAlias({index: indexTemplate, ignore: 404});
      const existingIndices = Object.keys(existingIndicesRsp || {});
      return Promise.all([
        client.indices.deleteTemplate({
          ignore: 404,
          name: indexTemplateName
        }),
        ...existingIndices.map(indexName => {
          console.log(`deleting ${indexName}`);
          return client.indices.delete({
            ignore: 404,
            index: indexName
          })
        }) 
      ]);
    }

    function create() {
      console.log('creating index template for "%s"', indexTemplate);
      return client.indices.putTemplate({
        name: indexTemplateName,
        body: body
      });
    }

    function maybeReset(reset) {
      switch (reset) {
      case true:
        return clearExisting().then(create);
      case false:
        if (!exists.indices) {
          return create();
        }
        return; // do nothing, index template exists
      default:
        return confirmReset(argv).then(maybeReset);
      }
    }

    if (exists.template || exists.indices) {
      return maybeReset(argv.reset);
    } else {
      return create();
    }
  }).catch(function (err) {console.error(err)});


};
