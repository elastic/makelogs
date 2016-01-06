var argv = require('./argv');
var client = require('./_client');
var omitFields = require('./_omitFields');

module.exports = function createIndex() {
  var indexTemplate = argv.indexPrefix + '*'
  var indexTemplateName = 'makelogs_index_template__' + argv.indexPrefix;

  var body = {
    template: indexTemplate,
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
      _default_: {
        dynamic_templates: [
          {
            string_fields: {
              match_mapping_type: 'string',
              match: '*',

              mapping: {
                type: 'string',
                index: 'analyzed',
                omit_norms: true,
                doc_values: false,
                type: 'string',

                fields: {
                  raw: {
                    index: 'not_analyzed',
                    type: 'string',
                    doc_values: true,
                  }
                }
              }
            }
          }
        ],

        // meta fields
        _timestamp: {
          enabled: true
        },

        // properties
        properties: omitFields({
          '@timestamp': {
            type: 'date'
          },
          id: {
            type: 'integer',
            index: 'not_analyzed',
            include_in_all: false
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
            type: 'string',
            index: 'not_analyzed'
          },
          geo: {
            properties: {
              srcdest: {
                type: 'string',
                index: 'not_analyzed'
              },
              dest: {
                type: 'string',
                index: 'not_analyzed'
              },
              src: {
                type: 'string',
                index: 'not_analyzed'
              },
              coordinates: {
                type: 'geo_point'
              }
            }
          },
          meta: {
            properties: {
              related: {
                type: 'string',
              },
              char: {
                type: 'string',
                index: 'not_analyzed'
              },
              user: {
                properties: {
                  firstname: {
                    type: 'string',
                  },
                  lastname: {
                    type: 'integer',
                    index: 'not_analyzed'
                  }
                }
              }
            }
          }
        }, true)
      }
    }
  }

  return client.usable
  .then(function () {
    return client.indices.existsTemplate({
      name: indexTemplateName
    })
  })
  .then(function (exists) {
    if (exists) {
      if (argv.reset) {
        exists = false
        console.log('clearing existing "%s" index template', indexTemplate);
        return client.indices.deleteTemplate({
          name: indexTemplateName
        });
      } else {
        console.log('index template for "%s" already exists, use --reset to recreate it', indexTemplate);
      }
    }

    if (!exists) {
      console.log('creating index template for "%s"', indexTemplate);
      return client.indices.putTemplate({
        ignore: 400,
        name: indexTemplateName,
        body: body
      });
    }
  })
  .then(function () {
    if (argv.reset) {
      return client.indices.delete({
        index: indexTemplate
      })
    }
  });
};
