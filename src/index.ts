#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { DailyMedClient } from "./dailymed-client.js";
import { dailyMedTools } from "./tools.js";

class DailyMedServer {
  private server: Server;
  private client: DailyMedClient;

  constructor() {
    this.server = new Server(
      {
        name: "dailymed-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    this.client = new DailyMedClient();
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: dailyMedTools,
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        if (!args) {
          throw new Error("Missing arguments");
        }

        switch (name) {
          case "get_dailymed_context":
            const contextInfo = await this.client.getDailyMedContext();
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(contextInfo, null, 2),
                },
              ],
            };

          case "search_drugs":
            const searchResults = await this.client.searchDrugNames(
              args.query as string,
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(searchResults, null, 2),
                },
              ],
            };

          case "get_drug_details":
            const drugDetails = await this.client.getSPLBySetId(
              args.setId as string,
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(drugDetails, null, 2),
                },
              ],
            };

          case "get_drug_history":
            const history = await this.client.getSPLHistory(
              args.setId as string,
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(history, null, 2),
                },
              ],
            };

          case "get_drug_ndcs":
            const ndcs = await this.client.getSPLNDCs(args.setId as string);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(ndcs, null, 2),
                },
              ],
            };

          case "get_drug_packaging":
            const packaging = await this.client.getSPLPackaging(
              args.setId as string,
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(packaging, null, 2),
                },
              ],
            };

          case "get_drug_media":
            const media = await this.client.getSPLMedia(args.setId as string);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(media, null, 2),
                },
              ],
            };

          case "get_all_drug_names":
            const allDrugNames = await this.client.getAllDrugNames();
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(allDrugNames, null, 2),
                },
              ],
            };

          case "get_all_drug_classes":
            const allDrugClasses = await this.client.getAllDrugClasses();
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(allDrugClasses, null, 2),
                },
              ],
            };

          case "get_all_ndcs":
            const allNDCs = await this.client.getAllNDCs();
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(allNDCs, null, 2),
                },
              ],
            };

          case "get_all_rxcuis":
            const allRxCUIs = await this.client.getAllRxCUIs();
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(allRxCUIs, null, 2),
                },
              ],
            };

          case "get_all_uniis":
            const allUNIIs = await this.client.getAllUNIIs();
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(allUNIIs, null, 2),
                },
              ],
            };

          case "get_all_application_numbers":
            const allAppNumbers = await this.client.getAllApplicationNumbers();
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(allAppNumbers, null, 2),
                },
              ],
            };

          case "get_download_links":
            const zipLink = await this.client.downloadSPLZip(
              args.setId as string,
            );
            const pdfLink = await this.client.downloadSPLPdf(
              args.setId as string,
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      zipDownload: zipLink,
                      pdfDownload: pdfLink,
                    },
                    null,
                    2,
                  ),
                },
              ],
            };

          case "search_spls":
            const splResults = await this.client.searchSPLs(
              args.query as string,
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(splResults, null, 2),
                },
              ],
            };

          case "search_rxcuis":
            const rxcuiParams: any = {};
            if (args.rxstring) rxcuiParams.rxstring = args.rxstring as string;
            if (args.rxcui) rxcuiParams.rxcui = args.rxcui as string;
            if (args.rxtty) rxcuiParams.rxtty = args.rxtty as string;

            const rxcuiResults = await this.client.searchRxCUIs(rxcuiParams);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(rxcuiResults, null, 2),
                },
              ],
            };

          case "search_application_numbers":
            const appNumParams: any = {};
            if (args.application_number)
              appNumParams.application_number =
                args.application_number as string;
            if (args.marketing_category_code)
              appNumParams.marketing_category_code =
                args.marketing_category_code as string;
            if (args.setid) appNumParams.setid = args.setid as string;

            const appNumResults =
              await this.client.searchApplicationNumbers(appNumParams);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(appNumResults, null, 2),
                },
              ],
            };

          case "search_drug_classes":
            const drugClassParams: any = {};
            if (args.drug_class_code)
              drugClassParams.drug_class_code = args.drug_class_code as string;
            if (args.drug_class_coding_system)
              drugClassParams.drug_class_coding_system =
                args.drug_class_coding_system as string;
            if (args.class_code_type)
              drugClassParams.class_code_type = args.class_code_type as string;
            if (args.class_name)
              drugClassParams.class_name = args.class_name as string;
            if (args.unii_code)
              drugClassParams.unii_code = args.unii_code as string;

            const drugClassResults =
              await this.client.searchDrugClasses(drugClassParams);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(drugClassResults, null, 2),
                },
              ],
            };

          case "get_mapping_statistics":
            const mappingStats = await this.client.getMappingStatistics();
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(mappingStats, null, 2),
                },
              ],
            };

          case "search_by_rxnorm_mapping":
            const rxNormSearchResults = await this.client.searchByRxNormMapping(
              args.drugName as string,
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(rxNormSearchResults, null, 2),
                },
              ],
            };

          case "get_rxnorm_mappings_for_setid":
            const rxNormMappings = await this.client.getRxNormMappingsForSetId(
              args.setId as string,
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(rxNormMappings, null, 2),
                },
              ],
            };

          case "get_pharmacologic_class_mappings_for_setid":
            const pharmacologicClassMappings = await this.client.getPharmacologicClassMappingsForSetId(
              args.setId as string,
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(pharmacologicClassMappings, null, 2),
                },
              ],
            };

          case "get_mappings_by_rxcui":
            const rxcuiMappings = await this.client.getMappingsByRxCUI(
              args.rxcui as string,
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(rxcuiMappings, null, 2),
                },
              ],
            };

          case "get_rxnorm_mappings_by_pharmacologic_class":
            const pharmaClassMappings = await this.client.getRxNormMappingsByPharmacologicClass(
              args.pharmaSetId as string,
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(pharmaClassMappings, null, 2),
                },
              ],
            };

          case "get_all_pharmacologic_class_setids":
            const allPharmaSetIds = await this.client.getAllPharmacologicClassSetIds();
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(allPharmaSetIds, null, 2),
                },
              ],
            };

          case "get_pharmacologic_class_details":
            const pharmaClassDetails = await this.client.getPharmacologicClassDetails(
              args.pharmaSetId as string,
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(pharmaClassDetails, null, 2),
                },
              ],
            };

          case "search_drugs_by_pharmacologic_class":
            const drugsByClass = await this.client.searchDrugsByPharmacologicClass(
              args.drugClassCode as string,
              args.codingSystem as string | undefined,
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(drugsByClass, null, 2),
                },
              ],
            };

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("DailyMed MCP server running on stdio");
  }
}

const server = new DailyMedServer();
server.run().catch(console.error);
