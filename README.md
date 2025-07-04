# MCP Server for DailyMed

A Model Context Protocol (MCP) server that provides access to the DailyMed API.

100% vibe coded, seems to work fine.

## About DailyMed

DailyMed is a comprehensive database provided by the National Library of Medicine (NLM) that contains official drug labeling information submitted to the FDA. It serves healthcare professionals, patients, researchers, and AI systems with the most recent drug labeling information for:

- FDA-approved prescription and nonprescription drugs
- Biological products, medical devices, and medical gases
- Animal drugs and some FDA-regulated unapproved products

**Key Features:**
- Official FDA-submitted drug labeling information
- Structured Product Labeling (SPL) standard format
- Multiple data formats (HTML, PDF, XML)
- Cross-references with RxNorm and pharmacologic classifications
- Free public access with regular updates

## Overview

This MCP server enables AI assistants to access comprehensive drug information from DailyMed, including:

- Drug names and active ingredients
- Structured Product Labels (SPLs)
- NDC codes
- Drug classes
- FDA application numbers
- RxCUI and UNII codes
- Drug packaging and media information
- Enhanced mapping data linking SPLs to RxNorm concepts and pharmacologic classes

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add the mapping files to the project root (optional but recommended):
   - Download `pharmacologic_class_mappings.txt` and `rxnorm_mappings.txt` from [DailyMed Mapping Files](https://dailymed.nlm.nih.gov/dailymed/app-support-mapping-files.cfm)
   - Place them in the project root directory alongside `package.json`
4. Build the TypeScript code:
   ```bash
   npm run build
   ```

## Usage

### Running the Server

Start the MCP server:

```bash
npm start
```

For development with hot reload:

```bash
npm run dev
```

### Available Tools

The server provides the following tools:

#### Context and Information Tools

- `get_dailymed_context` - Get comprehensive information about DailyMed database, its purpose, and when to use it

#### Search Tools

- `search_spls` - Search for Structured Product Labels (SPLs) using either simple drug name search or advanced DailyMed API parameters. Supports pagination and extensive filtering options.
- `search_rxcuis` - Search for RxCUI codes using various parameters
- `search_application_numbers` - Search for FDA application numbers (NDA, ANDA, etc.)
- `search_drug_classes` - Search for pharmacologic drug classes

#### Drug Information Tools

- `get_drug_details` - Get detailed information about a specific drug by SET ID
- `get_drug_history` - Get version history for a specific drug
- `get_drug_ndcs` - Get NDC codes for a specific drug
- `get_drug_packaging` - Get packaging information for a specific drug
- `get_drug_media` - Get media links (images, documents) for a specific drug
- `get_download_links` - Get ZIP and PDF download links for a specific drug

#### Database Query Tools

- `get_all_drug_names` - Get all available drug names
- `get_all_drug_classes` - Get all available drug classes
- `get_all_ndcs` - Get all available NDC codes
- `get_all_rxcuis` - Get all available RxCUI codes
- `get_all_uniis` - Get all available UNII codes
- `get_all_application_numbers` - Get all available FDA application numbers

#### Mapping Tools

- `get_mapping_statistics` - Get statistics about loaded mapping files
- `search_by_rxnorm_mapping` - Search for RxNorm mappings by drug name
- `get_rxnorm_mappings_for_setid` - Get RxNorm mappings for a specific SET ID
- `get_pharmacologic_class_mappings_for_setid` - Get pharmacologic class mappings for a specific SET ID
- `get_mappings_by_rxcui` - Get mappings for a specific RxCUI
- `get_rxnorm_mappings_by_pharmacologic_class` - Find RxNorm mappings for drugs in a specific pharmacologic class (uses mapping file data)
- `get_all_pharmacologic_class_setids` - Get all pharmacologic class SET IDs with drug mappings (from mapping files)
- `get_pharmacologic_class_details` - Get detailed information about a pharmacologic class (uses mapping file data)
- `search_drugs_by_pharmacologic_class` - Search for drugs using DailyMed drug class codes from the drug classes API. Supports pagination for large result sets.

### Advanced SPL Search

The `search_spls` tool supports two modes of operation:

#### 1. Simple Drug Name Search (Legacy Mode)
Uses the original approach: searches for drugs first, then finds related SPLs.

**Parameters:**
- `query` (required): Search query for drug name or active ingredient
- `page` (optional): Page number (1-based, default: 1)
- `pageSize` (optional): Results per page (default: 25, max: 200)

**Example:**
```json
{
  "query": "aspirin",
  "page": 1,
  "pageSize": 25
}
```

#### 2. Advanced DailyMed API Search (New Mode)
Directly queries the DailyMed SPLs API with powerful filtering options.

**Advanced Parameters:**
- `application_number`: NDA number (e.g., "NDA012345")
- `boxed_warning`: Filter by presence of boxed warning (boolean)
- `dea_schedule_code`: DEA schedule code (e.g., "none", "C48672")
- `doctype`: FDA document type
- `drug_class_code`: Pharmacologic drug class code
- `drug_name`: Generic or brand drug name for direct API search
- `name_type`: Name type filter ("g", "generic", "b", "brand", "both")
- `labeler`: Labeler name
- `manufacturer`: Manufacturer name
- `marketing_category_code`: FDA marketing category code
- `ndc`: National Drug Code
- `published_date`: Published date in YYYY-MM-DD format
- `published_date_comparison`: Date comparison ("lt", "lte", "gt", "gte", "eq")
- `rxcui`: RxNorm Concept Unique Identifier
- `setid`: Label Set ID
- `unii_code`: Unique Ingredient Identifier
- `page`: Page number (default: 1)
- `pageSize`: Results per page (default: 25, max: 100 for advanced queries)

**Advanced Search Examples:**

Find SPLs with boxed warnings:
```json
{
  "boxed_warning": true,
  "pageSize": 10
}
```

Search by manufacturer:
```json
{
  "manufacturer": "Pfizer",
  "page": 1
}
```

Find SPLs published after a specific date:
```json
{
  "published_date": "2023-01-01",
  "published_date_comparison": "gte"
}
```

Search by RxCUI:
```json
{
  "rxcui": "1191"
}
```

**Response Format:**
Both modes return the same paginated response structure:
```json
{
  "data": [
    // Array of SPL documents for the requested page
  ],
  "pagination": {
    "page": 1,
    "pageSize": 25,
    "totalResults": 150,
    "totalPages": 6,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Additional Pagination Support

The following tools also support pagination:

#### `search_drugs_by_pharmacologic_class`
Search for drugs using DailyMed drug class codes with pagination support.

**Parameters:**
- `drugClassCode` (required): The drug class code (e.g., "N0000175605" for Kinase Inhibitor)
- `codingSystem` (optional): Coding system (defaults to DailyMed's system)
- `page` (optional): Page number (1-based, default: 1)
- `pageSize` (optional): Results per page (default: 25, max: 100)

**Example:**
```json
{
  "drugClassCode": "N0000175605",
  "page": 1,
  "pageSize": 50
}
```

Returns the same paginated response format as `search_spls`.

### Configuration with Claude Desktop

Add this server to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "dailymed": {
      "command": "node",
      "args": [
        "/path/to/mcp-server-dailymed/dist/index.js"
      ],
      "cwd": "/path/to/mcp-server-dailymed"
    }
  }
}
```

## API Information

This server uses the DailyMed Web Services API v2:

- Base URL: https://dailymed.nlm.nih.gov/dailymed/services/v2
- Response Format: JSON
- No authentication required

## Error Handling

The server includes comprehensive error handling for:

- API request failures
- Invalid parameters
- Network timeouts
- Rate limiting

## Mapping Files

The server supports enhanced functionality when mapping files are present in the project root:

- **pharmacologic_class_mappings.txt**: Maps SPL SET IDs to pharmacologic class information
- **rxnorm_mappings.txt**: Maps SPL SET IDs to RxNorm concepts (RxCUI, drug names, term types)

These files enable:
- Enhanced drug detail responses with RxNorm and pharmacologic class mappings
- Direct mapping lookups by SET ID or RxCUI
- Drug name searches within mapping data
- Statistics about mapping coverage
- Cross-referencing drugs by pharmacologic class characteristics

### Understanding Pharmacologic Classes

According to FDA guidelines, a **pharmacologic class** is "a group of active moieties that share scientifically documented properties." These classifications are based on three key attributes:

1. **Mechanism of Action (MOA)** - How the drug works at the molecular level
2. **Physiologic Effect (PE)** - The body's response to the drug  
3. **Chemical Structure (CS)** - Structural characteristics of the active moiety

The FDA establishes "Established Pharmacologic Class" (EPC) text phrases that are scientifically valid and clinically meaningful. The source terminology is the National Drug File Reference Terminology (NDF-RT) maintained by the Department of Veterans Affairs.

This server provides tools to explore these relationships and understand how drugs are classified and grouped by their shared properties.

**Important Distinction:**
- **Mapping File Data**: The pharmacologic class SET IDs in mapping files are identifiers that group related drugs conceptually
- **DailyMed Drug Classes API**: Provides current, active drug class codes (like N0000175605) that can be used to search for drugs
- Both approaches provide valuable but different perspectives on drug classification

## Development

### Project Structure

```
src/
├── index.ts           # Main MCP server implementation
├── dailymed-client.ts # DailyMed API client
├── mapping-service.ts # Mapping file parser and service
└── tools.ts           # Tool definitions
```

### Building

```bash
npm run build
```

### TypeScript Configuration

The project uses strict TypeScript configuration with ES2022 target and ESNext modules.

## License

MIT License
