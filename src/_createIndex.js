import {
  attempt,
  props as asyncProps,
  all as asyncAll,
} from 'bluebird'

import { client } from './client'

const argv = require('./argv')
const omitFields = require('./_omitFields')
const confirmReset = require('./_confirmReset')

module.exports = function createIndex() {
  const indexTemplate = `${argv.indexPrefix}*`
  const indexTemplateName = `makelogs_index_template__${argv.indexPrefix}`

  const body = {
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
            max_token_length: 1000,
          },
        },
      },
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

                fields: {
                  raw: {
                    index: 'not_analyzed',
                    type: 'string',
                    doc_values: true,
                  },
                },
              },
            },
          },
        ],

        // properties
        properties: omitFields({
          '@timestamp': {
            type: 'date',
          },
          id: {
            type: 'integer',
            index: 'true',
            include_in_all: false,
          },
          clientip: {
            type: 'ip',
          },
          ip: {
            type: 'ip',
          },
          memory: {
            type: 'double',
          },
          referer: {
            type: 'string',
            index: 'not_analyzed',
          },
          geo: {
            properties: {
              srcdest: {
                type: 'string',
                index: 'not_analyzed',
              },
              dest: {
                type: 'string',
                index: 'not_analyzed',
              },
              src: {
                type: 'string',
                index: 'not_analyzed',
              },
              coordinates: {
                type: 'geo_point',
              },
            },
          },
          meta: {
            properties: {
              related: {
                type: 'string',
              },
              char: {
                type: 'string',
                index: 'not_analyzed',
              },
              user: {
                properties: {
                  firstname: {
                    type: 'string',
                  },
                  lastname: {
                    type: 'integer',
                    index: 'true',
                  },
                },
              },
            },
          },
        }, true),
      },
    },
  }

  return attempt(() => asyncProps({
    template: client.indices.existsTemplate({
      name: indexTemplateName,
    }),
    indices: client.indices.exists({
      index: indexTemplate,
    }),
  }))
  .then(exists => {
    function clearExisting() {
      console.log('clearing existing "%s" index templates and indices', indexTemplate)
      return asyncAll([
        client.indices.deleteTemplate({
          ignore: 404,
          name: indexTemplateName,
        }),
        client.indices.delete({
          ignore: 404,
          index: indexTemplate,
        }),
      ])
    }

    function create() {
      console.log('creating index template for "%s"', indexTemplate)
      return client.indices.putTemplate({
        name: indexTemplateName,
        body,
      })
    }

    function maybeReset(reset) {
      switch (reset) {
        case true:
          return clearExisting().then(create)
        case false:
          if (!exists.indices) {
            return create()
          }
          return undefined// do nothing, index template exists
        default:
          return confirmReset().then(maybeReset)
      }
    }

    if (exists.template || exists.indices) {
      return maybeReset(argv.reset)
    }

    return create()
  })
}
