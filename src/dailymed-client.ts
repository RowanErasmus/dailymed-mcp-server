import axios, { AxiosInstance } from "axios";
import { parseString } from "xml2js";
import { MappingService, RxNormMapping, PharmacologicClassMapping } from "./mapping-service.js";

export interface DailyMedResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

export interface SPLDocument {
  setId: string;
  title: string;
  effectiveTime: string;
  versionNumber: string;
  sections: SPLSection[];
  spl_medguide?: string;
  spl_patient_package_insert?: string;
  spl_product_data_elements?: string;
  rxNormMappings?: RxNormMapping[];
  pharmacologicClassMappings?: PharmacologicClassMapping[];
}

export interface SPLSection {
  id?: string;
  title: string;
  content: string;
}

export interface DrugName {
  drugName: string;
  routeOfAdministration?: string;
  activeIngredient?: string;
}

export interface NDC {
  ndc: string;
  packageNdc?: string;
  productNdc?: string;
}

export interface ApplicationNumber {
  applicationNumber: string;
  applicationNumberType?: string;
  marketingCategoryCode?: string;
  setId?: string;
}

export interface DrugClass {
  drugClassName: string;
  drugClassCode?: string;
  drugClassCodingSystem?: string;
  classCodeType?: string;
  uniiCode?: string;
}

export interface PharmacologicClassDetails {
  setId: string;
  title?: string;
  classificationInfo?: {
    mechanismOfAction?: string[];
    physiologicEffect?: string[];
    chemicalStructure?: string[];
    establishedPharmacologicClass?: string[];
  };
  fdaContext?: {
    definition: string;
    purpose: string;
    attributes: string[];
    sourceTerminology: string;
  };
}

export interface RxCUI {
  rxcui: string;
  drugName?: string;
  termType?: string;
}

export interface UNII {
  unii: string;
  substanceName?: string;
  uniiType?: string;
}

export class DailyMedClient {
  private client: AxiosInstance;
  private baseURL = "https://dailymed.nlm.nih.gov/dailymed/services/v2";
  private mappingService: MappingService;

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        Accept: "application/json",
        "User-Agent": "MCP-DailyMed-Server/1.0.0",
      },
      timeout: 30000,
    });

    this.mappingService = new MappingService();

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          throw new Error(
            `DailyMed API Error: ${error.response.status} - ${error.response.statusText}`,
          );
        } else if (error.request) {
          throw new Error(
            "DailyMed API Error: No response received from server",
          );
        } else {
          throw new Error(`DailyMed API Error: ${error.message}`);
        }
      },
    );
  }

  async getAllApplicationNumbers(): Promise<ApplicationNumber[]> {
    try {
      const response = await this.client.get("/applicationnumbers.json");

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data.map((item: any) => ({
          applicationNumber: item.application_number || item.applicationNumber,
          applicationNumberType:
            item.application_number_type || item.applicationNumberType,
          marketingCategoryCode: item.marketing_category_code,
          setId: item.setid,
        }));
      } else {
        throw new Error(
          "Unexpected response structure for application numbers",
        );
      }
    } catch (error) {
      throw new Error(
        `Failed to fetch application numbers: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async searchApplicationNumbers(params: {
    application_number?: string;
    marketing_category_code?: string;
    setid?: string;
  }): Promise<ApplicationNumber[]> {
    if (
      !params.application_number &&
      !params.marketing_category_code &&
      !params.setid
    ) {
      throw new Error(
        "At least one search parameter (application_number, marketing_category_code, or setid) is required",
      );
    }

    try {
      const queryParams: any = {};
      if (params.application_number)
        queryParams.application_number = params.application_number;
      if (params.marketing_category_code)
        queryParams.marketing_category_code = params.marketing_category_code;
      if (params.setid) queryParams.setid = params.setid;

      const response = await this.client.get("/applicationnumbers.json", {
        params: queryParams,
      });

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data.map((item: any) => ({
          applicationNumber: item.application_number || item.applicationNumber,
          applicationNumberType:
            item.application_number_type || item.applicationNumberType,
          marketingCategoryCode: item.marketing_category_code,
          setId: item.setid,
        }));
      } else {
        throw new Error(
          "Unexpected response structure for application number search",
        );
      }
    } catch (error) {
      throw new Error(
        `Failed to search application numbers: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async getAllDrugClasses(): Promise<DrugClass[]> {
    try {
      const response = await this.client.get("/drugclasses.json");

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data.map((item: any) => ({
          drugClassName: item.name,
          drugClassCode: item.code,
          drugClassCodingSystem: item.codingSystem,
          classCodeType: item.type,
          uniiCode: item.unii_code,
        }));
      } else {
        throw new Error("Unexpected response structure for drug classes");
      }
    } catch (error) {
      throw new Error(
        `Failed to fetch drug classes: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async searchDrugClasses(params: {
    drug_class_code?: string;
    drug_class_coding_system?: string;
    class_code_type?: string;
    class_name?: string;
    unii_code?: string;
  }): Promise<DrugClass[]> {
    if (
      !params.drug_class_code &&
      !params.drug_class_coding_system &&
      !params.class_code_type &&
      !params.class_name &&
      !params.unii_code
    ) {
      throw new Error("At least one search parameter is required");
    }

    try {
      const queryParams: any = {};
      if (params.drug_class_code)
        queryParams.drug_class_code = params.drug_class_code;
      if (params.drug_class_coding_system)
        queryParams.drug_class_coding_system = params.drug_class_coding_system;
      if (params.class_code_type)
        queryParams.class_code_type = params.class_code_type;
      if (params.class_name) queryParams.class_name = params.class_name;
      if (params.unii_code) queryParams.unii_code = params.unii_code;

      const response = await this.client.get("/drugclasses.json", {
        params: queryParams,
      });

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data.map((item: any) => ({
          drugClassName: item.name,
          drugClassCode: item.code,
          drugClassCodingSystem: item.codingSystem,
          classCodeType: item.type,
          uniiCode: item.unii_code,
        }));
      } else {
        throw new Error("Unexpected response structure for drug class search");
      }
    } catch (error) {
      throw new Error(
        `Failed to search drug classes: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async getAllDrugNames(): Promise<DrugName[]> {
    try {
      const response = await this.client.get("/drugnames.json");

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data.map((item: any) => ({
          drugName: item.drug_name,
          routeOfAdministration: item.route_of_administration,
          activeIngredient: item.active_ingredient,
        }));
      } else {
        throw new Error("Unexpected response structure for drug names");
      }
    } catch (error) {
      throw new Error(
        `Failed to fetch drug names: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async getAllNDCs(): Promise<NDC[]> {
    try {
      const response = await this.client.get("/ndcs.json");

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data.map((item: any) => ({
          ndc: item.ndc,
          packageNdc: item.package_ndc || item.packageNdc,
          productNdc: item.product_ndc || item.productNdc,
        }));
      } else {
        throw new Error("Unexpected response structure for NDCs");
      }
    } catch (error) {
      throw new Error(
        `Failed to fetch NDCs: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async getAllRxCUIs(): Promise<RxCUI[]> {
    try {
      const response = await this.client.get("/rxcuis.json");

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data.map((item: any) => ({
          rxcui: item.rxcui,
          drugName: item.rxstring || item.drug_name || item.drugName,
          termType: item.rxtty,
        }));
      } else {
        throw new Error("Unexpected response structure for RxCUIs");
      }
    } catch (error) {
      throw new Error(
        `Failed to fetch RxCUIs: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async searchRxCUIs(params: {
    rxstring?: string;
    rxcui?: string;
    rxtty?: string;
  }): Promise<RxCUI[]> {
    if (!params.rxstring && !params.rxcui && !params.rxtty) {
      throw new Error(
        "At least one search parameter (rxstring, rxcui, or rxtty) is required",
      );
    }

    try {
      const queryParams: any = {};
      if (params.rxstring) queryParams.rxstring = params.rxstring;
      if (params.rxcui) queryParams.rxcui = params.rxcui;
      if (params.rxtty) queryParams.rxtty = params.rxtty;

      const response = await this.client.get("/rxcuis.json", {
        params: queryParams,
      });

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data.map((item: any) => ({
          rxcui: item.rxcui,
          drugName: item.rxstring || item.drug_name || item.drugName,
          termType: item.rxtty,
        }));
      } else {
        throw new Error("Unexpected response structure for RxCUI search");
      }
    } catch (error) {
      throw new Error(
        `Failed to search RxCUIs: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async getAllUNIIs(): Promise<UNII[]> {
    try {
      const response = await this.client.get("/uniis.json");

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data.map((item: any) => ({
          unii: item.unii,
          substanceName: item.substance_name || item.substanceName,
          uniiType: item.unii_type,
        }));
      } else {
        throw new Error("Unexpected response structure for UNIIs");
      }
    } catch (error) {
      throw new Error(
        `Failed to fetch UNIIs: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async searchUNIIs(params: {
    active_moiety?: string;
    drug_class_code?: string;
    drug_class_coding_system?: string;
    rxcui?: string;
    unii_code?: string;
  }): Promise<UNII[]> {
    if (
      !params.active_moiety &&
      !params.drug_class_code &&
      !params.drug_class_coding_system &&
      !params.rxcui &&
      !params.unii_code
    ) {
      throw new Error("At least one search parameter is required");
    }

    try {
      const queryParams: any = {};
      if (params.active_moiety)
        queryParams.active_moiety = params.active_moiety;
      if (params.drug_class_code)
        queryParams.drug_class_code = params.drug_class_code;
      if (params.drug_class_coding_system)
        queryParams.drug_class_coding_system = params.drug_class_coding_system;
      if (params.rxcui) queryParams.rxcui = params.rxcui;
      if (params.unii_code) queryParams.unii_code = params.unii_code;

      const response = await this.client.get("/uniis.json", {
        params: queryParams,
      });

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data.map((item: any) => ({
          unii: item.unii,
          substanceName: item.substance_name || item.substanceName,
          uniiType: item.unii_type,
        }));
      } else {
        throw new Error("Unexpected response structure for UNII search");
      }
    } catch (error) {
      throw new Error(
        `Failed to search UNIIs: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async getAllSPLs(): Promise<SPLDocument[]> {
    try {
      const response = await this.client.get("/spls.json");

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data.map((item: any) => ({
          setId: item.setid,
          title: item.title,
          effectiveTime: item.published_date,
          versionNumber: item.spl_version?.toString() || "1",
          spl_medguide: item.spl_medguide,
          spl_patient_package_insert: item.spl_patient_package_insert,
          spl_product_data_elements: item.spl_product_data_elements,
        }));
      } else {
        throw new Error("Unexpected response structure for SPLs");
      }
    } catch (error) {
      throw new Error(
        `Failed to fetch SPLs: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async getSPLBySetId(setId: string): Promise<SPLDocument> {
    if (!setId || typeof setId !== "string") {
      throw new Error("Valid setId is required");
    }

    try {
      // Use the XML endpoint as documented
      const response = await this.client.get(`/spls/${setId}.xml`);

      return new Promise((resolve, reject) => {
        parseString(response.data, (err, result) => {
          if (err) {
            reject(new Error(`Failed to parse XML: ${err.message}`));
            return;
          }

          try {
            // Extract information from the parsed XML
            const document = result.document;
            const title = this.extractTextContent(document.title?.[0]);
            const effectiveTime = document.effectiveTime?.[0]?.$.value || "";
            const versionNumber = document.versionNumber?.[0]?.$.value || "1";

            // Extract sections from the structured body
            const sections: SPLSection[] = [];

            if (document.component?.[0]?.structuredBody?.[0]?.component) {
              const components =
                document.component[0].structuredBody[0].component;

              for (const comp of components) {
                if (comp.section?.[0]) {
                  const section = comp.section[0];
                  const sectionTitle = section.title
                    ? this.extractTextContent(section.title[0])
                    : "";
                  let sectionContent = section.text
                    ? this.extractTextContent(section.text[0])
                    : "";

                  // Handle subsections
                  if (section.component && Array.isArray(section.component)) {
                    const subsections: string[] = [];

                    for (const subComp of section.component) {
                      if (subComp.section?.[0]) {
                        const subSection = subComp.section[0];
                        const subTitle = subSection.title
                          ? this.extractTextContent(subSection.title[0])
                          : "";
                        const subContent = subSection.text
                          ? this.extractTextContent(subSection.text[0])
                          : "";

                        if (subTitle || subContent) {
                          let subsectionText = "";
                          if (subTitle) subsectionText += `## ${subTitle}\n\n`;
                          if (subContent) subsectionText += subContent;
                          subsections.push(subsectionText);
                        }
                      }
                    }

                    if (subsections.length > 0) {
                      if (sectionContent) sectionContent += "\n\n";
                      sectionContent += subsections.join("\n\n");
                    }
                  }

                  if (sectionTitle || sectionContent) {
                    sections.push({
                      id: section.id?.[0]?.$.root || undefined,
                      title: sectionTitle,
                      content: sectionContent,
                    });
                  }
                }
              }
            }

            // Get mapping data for this setId
            const rxNormMappings = this.mappingService.getRxNormMappings(setId);
            const pharmacologicClassMappings = this.mappingService.getPharmacologicClassMappings(setId);

            resolve({
              setId: setId,
              title: title || "No title available",
              effectiveTime: effectiveTime,
              versionNumber: versionNumber,
              sections: sections,
              spl_medguide: undefined,
              spl_patient_package_insert: undefined,
              spl_product_data_elements: undefined,
              rxNormMappings: rxNormMappings.length > 0 ? rxNormMappings : undefined,
              pharmacologicClassMappings: pharmacologicClassMappings.length > 0 ? pharmacologicClassMappings : undefined,
            });
          } catch (parseError) {
            reject(
              new Error(
                `Failed to extract data from XML: ${parseError instanceof Error ? parseError.message : "Unknown error"}`,
              ),
            );
          }
        });
      });
    } catch (error) {
      throw new Error(
        `Failed to fetch SPL for setId ${setId}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private extractTextContent(element: any): string {
    if (!element) return "";
    if (typeof element === "string") return element.trim();

    // Handle direct text content
    if (element._) return element._.trim();

    // Handle content arrays (like in titles)
    if (element.content && Array.isArray(element.content)) {
      return element.content
        .map((item: any) => this.extractTextContent(item))
        .join(" ")
        .trim();
    }

    // Handle paragraph arrays (like in section text)
    if (element.paragraph && Array.isArray(element.paragraph)) {
      return element.paragraph
        .map((para: any) => this.extractTextContent(para))
        .join("\n\n")
        .trim();
    }

    // Handle lists
    if (element.list && Array.isArray(element.list)) {
      return element.list
        .map((list: any) => this.extractListContent(list))
        .join("\n\n")
        .trim();
    }

    // Handle tables
    if (element.table && Array.isArray(element.table)) {
      return element.table
        .map((table: any) => this.extractTableContent(table))
        .join("\n\n")
        .trim();
    }

    // Handle nested elements
    if (typeof element === "object") {
      const textParts: string[] = [];

      for (const key in element) {
        if (key !== "$" && key !== "sup" && key !== "sub" && key !== "br") {
          const value = element[key];
          if (Array.isArray(value)) {
            for (const item of value) {
              const text = this.extractTextContent(item);
              if (text) textParts.push(text);
            }
          } else {
            const text = this.extractTextContent(value);
            if (text) textParts.push(text);
          }
        }
      }

      return textParts.join(" ").trim();
    }

    return "";
  }

  private extractListContent(list: any): string {
    if (!list.item || !Array.isArray(list.item)) return "";

    const listType = list.$?.listType || "unordered";
    const isOrdered = listType === "ordered";

    return list.item
      .map((item: any, index: number) => {
        const bullet = isOrdered ? `${index + 1}. ` : "• ";
        const itemText = this.extractTextContent(item);
        return bullet + itemText;
      })
      .join("\n");
  }

  private extractTableContent(table: any): string {
    if (!table.tbody && !table.thead) return "";

    const rows: string[] = [];

    // Handle table header
    if (table.thead && Array.isArray(table.thead)) {
      for (const thead of table.thead) {
        if (thead.tr && Array.isArray(thead.tr)) {
          for (const tr of thead.tr) {
            if (tr.th && Array.isArray(tr.th)) {
              const headerRow = tr.th
                .map((th: any) => this.extractTextContent(th))
                .join(" | ");
              rows.push(headerRow);
              rows.push("-".repeat(headerRow.length)); // Add separator
            }
          }
        }
      }
    }

    // Handle table body
    if (table.tbody && Array.isArray(table.tbody)) {
      for (const tbody of table.tbody) {
        if (tbody.tr && Array.isArray(tbody.tr)) {
          for (const tr of tbody.tr) {
            if (tr.td && Array.isArray(tr.td)) {
              const dataRow = tr.td
                .map((td: any) => this.extractTextContent(td))
                .join(" | ");
              rows.push(dataRow);
            }
          }
        }
      }
    }

    return rows.join("\n");
  }

  async getSPLHistory(setId: string): Promise<any> {
    if (!setId || typeof setId !== "string") {
      throw new Error("Valid setId is required");
    }

    try {
      const response = await this.client.get(`/spls/${setId}/history.json`);
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch SPL history for setId ${setId}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async getSPLMedia(setId: string): Promise<any> {
    if (!setId || typeof setId !== "string") {
      throw new Error("Valid setId is required");
    }

    try {
      const response = await this.client.get(`/spls/${setId}/media.json`);
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch SPL media for setId ${setId}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async getSPLNDCs(setId: string): Promise<NDC[]> {
    if (!setId || typeof setId !== "string") {
      throw new Error("Valid setId is required");
    }

    try {
      const response = await this.client.get(`/spls/${setId}/ndcs.json`);
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch SPL NDCs for setId ${setId}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async getSPLPackaging(setId: string): Promise<any> {
    if (!setId || typeof setId !== "string") {
      throw new Error("Valid setId is required");
    }

    try {
      const response = await this.client.get(`/spls/${setId}/packaging.json`);
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch SPL packaging for setId ${setId}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async downloadSPLZip(setId: string): Promise<string> {
    return `https://dailymed.nlm.nih.gov/dailymed/downloadzipfile.cfm?setId=${setId}`;
  }

  async downloadSPLPdf(setId: string): Promise<string> {
    return `https://dailymed.nlm.nih.gov/dailymed/downloadpdffile.cfm?setId=${setId}`;
  }

  async searchDrugNames(query: string): Promise<DrugName[]> {
    if (!query || typeof query !== "string") {
      throw new Error("Valid query string is required");
    }

    try {
      const response = await this.client.get("/drugnames.json", {
        params: { drug_name: query },
      });

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data.map((item: any) => ({
          drugName: item.drug_name,
          routeOfAdministration: item.route_of_administration,
          activeIngredient: item.active_ingredient,
        }));
      } else {
        throw new Error("Unexpected response structure for drug name search");
      }
    } catch (error) {
      throw new Error(
        `Failed to search drug names: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async searchSPLs(query: string): Promise<SPLDocument[]> {
    if (!query || typeof query !== "string") {
      throw new Error("Valid query string is required");
    }

    try {
      const response = await this.client.get("/spls.json", {
        params: { drug_name: query },
      });

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data.map((item: any) => {
          const setId = item.setid;
          const rxNormMappings = this.mappingService.getRxNormMappings(setId);
          const pharmacologicClassMappings = this.mappingService.getPharmacologicClassMappings(setId);

          return {
            setId: setId,
            title: item.title,
            effectiveTime: item.published_date,
            versionNumber: item.spl_version?.toString() || "1",
            sections: [],
            spl_medguide: item.spl_medguide,
            spl_patient_package_insert: item.spl_patient_package_insert,
            spl_product_data_elements: item.spl_product_data_elements,
            rxNormMappings: rxNormMappings.length > 0 ? rxNormMappings : undefined,
            pharmacologicClassMappings: pharmacologicClassMappings.length > 0 ? pharmacologicClassMappings : undefined,
          };
        });
      } else {
        throw new Error("Unexpected response structure for SPL search");
      }
    } catch (error) {
      throw new Error(
        `Failed to search SPLs: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  // Mapping service methods
  async getMappingStatistics(): Promise<any> {
    return this.mappingService.getStatistics();
  }

  async searchByRxNormMapping(drugName: string): Promise<RxNormMapping[]> {
    return this.mappingService.searchRxNormMappingsByName(drugName);
  }

  async getRxNormMappingsForSetId(setId: string): Promise<RxNormMapping[]> {
    return this.mappingService.getRxNormMappings(setId);
  }

  async getPharmacologicClassMappingsForSetId(setId: string): Promise<PharmacologicClassMapping[]> {
    return this.mappingService.getPharmacologicClassMappings(setId);
  }

  async getMappingsByRxCUI(rxcui: string): Promise<RxNormMapping[]> {
    return this.mappingService.getMappingsByRxCUI(rxcui);
  }

  async getRxNormMappingsByPharmacologicClass(pharmaSetId: string): Promise<{
    pharmaSetId: string;
    splSetIds: string[];
    rxNormMappings: RxNormMapping[];
    fdaContext: {
      definition: string;
      explanation: string;
      classification: string[];
    };
  }> {
    return this.mappingService.getRxNormMappingsByPharmacologicClass(pharmaSetId);
  }

  async getAllPharmacologicClassSetIds(): Promise<string[]> {
    return this.mappingService.getAllPharmacologicClassSetIds();
  }

  async searchDrugsByPharmacologicClass(drugClassCode: string, codingSystem?: string): Promise<SPLDocument[]> {
    if (!drugClassCode || typeof drugClassCode !== "string") {
      throw new Error("Valid drug class code is required");
    }

    try {
      // Use the SPLs API to search for drugs by drug class code
      // Default to the coding system used by the drug classes API
      const params: any = { 
        drug_class_code: drugClassCode,
        drug_class_coding_system: codingSystem || "2.16.840.1.113883.6.345"
      };
      
      const response = await this.client.get("/spls.json", {
        params: params,
      });

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data.map((item: any) => {
          const setId = item.setid;
          const rxNormMappings = this.mappingService.getRxNormMappings(setId);
          const pharmacologicClassMappings = this.mappingService.getPharmacologicClassMappings(setId);

          return {
            setId: setId,
            title: item.title,
            effectiveTime: item.published_date,
            versionNumber: item.spl_version?.toString() || "1",
            sections: [],
            spl_medguide: item.spl_medguide,
            spl_patient_package_insert: item.spl_patient_package_insert,
            spl_product_data_elements: item.spl_product_data_elements,
            rxNormMappings: rxNormMappings.length > 0 ? rxNormMappings : undefined,
            pharmacologicClassMappings: pharmacologicClassMappings.length > 0 ? pharmacologicClassMappings : undefined,
          };
        });
      } else {
        throw new Error("Unexpected response structure for drug class search");
      }
    } catch (error) {
      throw new Error(
        `Failed to search drugs by pharmacologic class: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async getPharmacologicClassDetails(pharmaSetId: string): Promise<PharmacologicClassDetails> {
    if (!pharmaSetId || typeof pharmaSetId !== "string") {
      throw new Error("Valid pharmacologic class SET ID is required");
    }

    // Note: The pharmacologic class SET IDs from mapping files are NOT retrievable SPL documents
    // They appear to be legacy/internal identifiers that represent conceptual groupings
    const mappingInfo = this.mappingService.getRxNormMappingsByPharmacologicClass(pharmaSetId);
    
    // Try to find related drug class information from the drug classes API
    // by examining the drugs that belong to this pharmacologic class
    let relatedDrugClasses: DrugClass[] = [];
    if (mappingInfo.splSetIds.length > 0) {
      // Get the first few drugs to see if we can find drug class information
      for (let i = 0; i < Math.min(3, mappingInfo.splSetIds.length); i++) {
        try {
          const splDoc = await this.getSPLBySetId(mappingInfo.splSetIds[i]);
          // Extract any drug class information from this drug's SPL
          const drugClassInfo = this.extractPharmacologicClassInfo(splDoc);
          if (drugClassInfo.establishedPharmacologicClass) {
            // This would contain any class information found in the drug's SPL
          }
        } catch (error) {
          // Skip if SPL not accessible
        }
      }
    }
    
    return {
      setId: pharmaSetId,
      title: `Pharmacologic Class Grouping (${mappingInfo.splSetIds.length} associated drugs)`,
      classificationInfo: {
        establishedPharmacologicClass: [
          `Legacy pharmacologic class identifier linking ${mappingInfo.splSetIds.length} drug SPL documents`,
          `Associated with ${mappingInfo.rxNormMappings.length} RxNorm concept mappings`
        ]
      },
      fdaContext: {
        definition: "A group of active moieties that share scientifically documented properties",
        purpose: "To provide clinically meaningful and scientifically valid drug classifications for approved indications",
        attributes: [
          "Mechanism of Action (MOA) - how the drug works at the molecular level",
          "Physiologic Effect (PE) - the body's response to the drug", 
          "Chemical Structure (CS) - structural characteristics of the active moiety"
        ],
        sourceTerminology: "National Drug File Reference Terminology (NDF-RT)"
      }
    };
  }

  private extractPharmacologicClassInfo(splDocument: SPLDocument): {
    mechanismOfAction?: string[];
    physiologicEffect?: string[];
    chemicalStructure?: string[];
    establishedPharmacologicClass?: string[];
  } {
    const classificationInfo: any = {};
    
    // Look through sections for pharmacologic class information
    for (const section of splDocument.sections) {
      const sectionTitle = section.title.toLowerCase();
      const content = section.content;
      
      if (sectionTitle.includes('mechanism of action') || sectionTitle.includes('pharmacology')) {
        classificationInfo.mechanismOfAction = this.extractClassificationTerms(content, 'mechanism');
      }
      
      if (sectionTitle.includes('pharmacologic') || sectionTitle.includes('class')) {
        classificationInfo.establishedPharmacologicClass = this.extractClassificationTerms(content, 'class');
      }
      
      if (sectionTitle.includes('effect') || sectionTitle.includes('pharmacodynamics')) {
        classificationInfo.physiologicEffect = this.extractClassificationTerms(content, 'effect');
      }
    }
    
    return classificationInfo;
  }

  private extractClassificationTerms(content: string, type: string): string[] {
    // Simple extraction - look for key phrases and sentences
    const terms: string[] = [];
    const sentences = content.split(/[.!?]/);
    
    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (trimmed.length > 10 && trimmed.length < 200) {
        // Look for classification-related terms
        if (type === 'mechanism' && (
          trimmed.toLowerCase().includes('inhibit') ||
          trimmed.toLowerCase().includes('block') ||
          trimmed.toLowerCase().includes('bind') ||
          trimmed.toLowerCase().includes('target')
        )) {
          terms.push(trimmed);
        } else if (type === 'class' && (
          trimmed.toLowerCase().includes('class') ||
          trimmed.toLowerCase().includes('group') ||
          trimmed.toLowerCase().includes('category')
        )) {
          terms.push(trimmed);
        } else if (type === 'effect' && (
          trimmed.toLowerCase().includes('effect') ||
          trimmed.toLowerCase().includes('response') ||
          trimmed.toLowerCase().includes('action')
        )) {
          terms.push(trimmed);
        }
      }
    }
    
    return terms.slice(0, 5); // Limit to 5 most relevant terms
  }
}
