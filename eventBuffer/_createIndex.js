var argv = require('../argv');
var client = require('../_client');

module.exports = function createIndex(indexName) {
  argv.log('ensuring index "%s" exists', indexName);

  var dynamicTemplates = [ {
    string_fields : {
      mapping : {
        type : 'multi_field',
        doc_values: true,
        fields : {
          hash: {
            type: 'murmur3'
          },
          '{name}' : {
            index : 'analyzed',
            omit_norms : true,
            type : 'string',
          },
          raw : {
            index : 'not_analyzed',
            type : 'string',
            doc_values: true,
          }
        }
      },
      match_mapping_type : 'string',
      match : '*'
    }
  }];

  var indexBody = {
    settings: {
      index: {
        number_of_shards: argv.shards,
        number_of_replicas: argv.replicas
      },
      analysis: {
        analyzer: {
          url: {
            type: 'standard',
            tokenizer: 'uax_url_email',
            max_token_length: 1000
          }
        }
      }
    },
    mappings: {
      _default_: {
        dynamic_templates : dynamicTemplates,
        _timestamp: {
          enabled: true,
          store: 'yes'
        },
        properties: {
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
        }
      }
    }
  };

  return client.usable
  .then(function () {
    return client.indices.create({
      ignore: 400,
      index: indexName,
      body: indexBody
    });
  })
  .then(function () {
    return client.cluster.health({
      index: indexName,
      waitForStatus: 'yellow'
    });
  });
};
