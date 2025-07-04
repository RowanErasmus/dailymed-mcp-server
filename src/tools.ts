import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const dailyMedTools: Tool[] = [
  {
    name: "search_drugs",
    description: "Search for drugs by name or active ingredient",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query for drug name or active ingredient",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_drug_details",
    description: "Get detailed information about a specific drug by its SET ID",
    inputSchema: {
      type: "object",
      properties: {
        setId: {
          type: "string",
          description: "The SET ID of the drug to get details for",
        },
      },
      required: ["setId"],
    },
  },
  {
    name: "get_drug_history",
    description: "Get version history for a specific drug by its SET ID",
    inputSchema: {
      type: "object",
      properties: {
        setId: {
          type: "string",
          description: "The SET ID of the drug to get history for",
        },
      },
      required: ["setId"],
    },
  },
  {
    name: "get_drug_ndcs",
    description: "Get NDC codes for a specific drug by its SET ID",
    inputSchema: {
      type: "object",
      properties: {
        setId: {
          type: "string",
          description: "The SET ID of the drug to get NDCs for",
        },
      },
      required: ["setId"],
    },
  },
  {
    name: "get_drug_packaging",
    description: "Get packaging information for a specific drug by its SET ID",
    inputSchema: {
      type: "object",
      properties: {
        setId: {
          type: "string",
          description: "The SET ID of the drug to get packaging info for",
        },
      },
      required: ["setId"],
    },
  },
  {
    name: "get_drug_media",
    description:
      "Get media links (images, documents) for a specific drug by its SET ID",
    inputSchema: {
      type: "object",
      properties: {
        setId: {
          type: "string",
          description: "The SET ID of the drug to get media for",
        },
      },
      required: ["setId"],
    },
  },
  {
    name: "get_all_drug_names",
    description: "Get all available drug names in the DailyMed database",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_all_drug_classes",
    description: "Get all available drug classes in the DailyMed database",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_all_ndcs",
    description: "Get all available NDC codes in the DailyMed database",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_all_rxcuis",
    description: "Get all available RxCUI codes in the DailyMed database",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_all_uniis",
    description: "Get all available UNII codes in the DailyMed database",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_all_application_numbers",
    description:
      "Get all available FDA application numbers in the DailyMed database",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_download_links",
    description:
      "Get download links for ZIP and PDF files of a specific drug by its SET ID",
    inputSchema: {
      type: "object",
      properties: {
        setId: {
          type: "string",
          description: "The SET ID of the drug to get download links for",
        },
      },
      required: ["setId"],
    },
  },
  {
    name: "search_spls",
    description: "Search for Structured Product Labels (SPLs) by title",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query for SPL title",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "search_rxcuis",
    description: "Search for RxCUI codes using various parameters",
    inputSchema: {
      type: "object",
      properties: {
        rxstring: {
          type: "string",
          description: "RxString value of an RxConcept (drug name/description)",
        },
        rxcui: {
          type: "string",
          description: "Specific RxCUI identifier to search for",
        },
        rxtty: {
          type: "string",
          description:
            "Term Type of RxConcept (e.g., PSN, SBD, SCD, BPCK, GPCK, SY)",
        },
      },
    },
  },
  {
    name: "search_application_numbers",
    description:
      "Search for FDA application numbers (NDA, ANDA, etc.) using various parameters",
    inputSchema: {
      type: "object",
      properties: {
        application_number: {
          type: "string",
          description: "Specific drug application number (e.g., NDA022527)",
        },
        marketing_category_code: {
          type: "string",
          description: "Marketing category code for a drug",
        },
        setid: {
          type: "string",
          description: "Set ID of a drug label",
        },
      },
    },
  },
  {
    name: "search_drug_classes",
    description:
      "Search for pharmacologic drug classes using various parameters",
    inputSchema: {
      type: "object",
      properties: {
        drug_class_code: {
          type: "string",
          description: "Code representing a pharmacologic drug class",
        },
        drug_class_coding_system: {
          type: "string",
          description:
            "Coding system (default: National Drug File Reference Terminology)",
        },
        class_code_type: {
          type: "string",
          description: "Type of pharmacologic drug class",
          enum: ["all", "epc", "moa", "pe", "ci"],
        },
        class_name: {
          type: "string",
          description: "Name of the drug class",
        },
        unii_code: {
          type: "string",
          description: "Unique Ingredient Identifier code",
        },
      },
    },
  },
  {
    name: "get_mapping_statistics",
    description: "Get statistics about loaded mapping files",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "search_by_rxnorm_mapping",
    description: "Search for RxNorm mappings by drug name",
    inputSchema: {
      type: "object",
      properties: {
        drugName: {
          type: "string",
          description: "Drug name to search for in RxNorm mappings",
        },
      },
      required: ["drugName"],
    },
  },
  {
    name: "get_rxnorm_mappings_for_setid",
    description: "Get RxNorm mappings for a specific SET ID",
    inputSchema: {
      type: "object",
      properties: {
        setId: {
          type: "string",
          description: "The SET ID to get RxNorm mappings for",
        },
      },
      required: ["setId"],
    },
  },
  {
    name: "get_pharmacologic_class_mappings_for_setid",
    description: "Get pharmacologic class mappings for a specific SET ID",
    inputSchema: {
      type: "object",
      properties: {
        setId: {
          type: "string",
          description: "The SET ID to get pharmacologic class mappings for",
        },
      },
      required: ["setId"],
    },
  },
  {
    name: "get_mappings_by_rxcui",
    description: "Get mappings for a specific RxCUI",
    inputSchema: {
      type: "object",
      properties: {
        rxcui: {
          type: "string",
          description: "The RxCUI to get mappings for",
        },
      },
      required: ["rxcui"],
    },
  },
  {
    name: "get_rxnorm_mappings_by_pharmacologic_class",
    description: "Find RxNorm mappings for drugs that belong to a specific pharmacologic class SET ID",
    inputSchema: {
      type: "object",
      properties: {
        pharmaSetId: {
          type: "string",
          description: "The pharmacologic class SET ID to find RxNorm mappings for",
        },
      },
      required: ["pharmaSetId"],
    },
  },
  {
    name: "get_all_pharmacologic_class_setids",
    description: "Get all pharmacologic class SET IDs that have associated drug mappings",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_pharmacologic_class_details",
    description: "Get detailed information about a pharmacologic class including FDA context and classification attributes (uses mapping file data)",
    inputSchema: {
      type: "object",
      properties: {
        pharmaSetId: {
          type: "string",
          description: "The pharmacologic class SET ID to get details for",
        },
      },
      required: ["pharmaSetId"],
    },
  },
  {
    name: "search_drugs_by_pharmacologic_class",
    description: "Search for drugs using DailyMed drug class codes (from the drug classes API)",
    inputSchema: {
      type: "object",
      properties: {
        drugClassCode: {
          type: "string",
          description: "The drug class code (e.g., N0000175605 for Kinase Inhibitor) from DailyMed drug classes API",
        },
        codingSystem: {
          type: "string",
          description: "The coding system for the drug class code (defaults to 2.16.840.1.113883.6.345 which matches the drug classes API)",
        },
      },
      required: ["drugClassCode"],
    },
  },
];
