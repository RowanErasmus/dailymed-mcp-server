# MCP Server for DailyMed

A Model Context Protocol (MCP) server that provides access to the DailyMed drug information database through the
National Library of Medicine's web services API.

100% vibe coded, seems to work fine.

## Overview

This MCP server enables AI assistants to access comprehensive drug information from DailyMed, including:

- Drug names and active ingredients
- Structured Product Labels (SPLs)
- NDC codes
- Drug classes
- FDA application numbers
- RxCUI and UNII codes
- Drug packaging and media information

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the TypeScript code:
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

#### Search Tools

- `search_drugs` - Search for drugs by name or active ingredient
- `search_spls` - Search for Structured Product Labels by title

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

## Development

### Project Structure

```
src/
├── index.ts           # Main MCP server implementation
├── dailymed-client.ts # DailyMed API client
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
