# Vectera Search Website

This project is a website that allows users to search for content using the Vectera APIs. The search functionality is implemented using JavaScript and the Vectera APIs.

## Getting Started

To get started with this project, you will need to set up your environment variables in the `.env` file. This file should contain the following variables:

- `VECTERA_SERVING_ENDPOINT`: The endpoint for the Vectera serving API.
- `VECTERA_CUSTOMER_ID`: The customer ID for your Vectera account.
- `VECTERA_CORPUS_ID`: The ID of the corpus you want to search.
- `VECTERA_AUTH_URL`: The URL for the Vectera authentication API.
- `VECTERA_CLIENT_ID`: The client ID for your Vectera account.
- `VECTERA_CLIENT_SECRET`: The client secret for your Vectera account.

Once you have set up your environment variables, you can run the project using the following commands:

```
npm install
npm run build
npm start
```

This will install the dependencies, build the project, and start the server. You can then access the website at `http://localhost:8080`.

## Usage

To use the search functionality, simply type your query into the search bar and press enter. The search results will be displayed below the search bar.

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request. We welcome contributions of all kinds, including bug fixes, feature requests, and documentation improvements.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more information.