import { GqlLocation } from 'entities/GqlLocation';
import gql from 'graphql-tag';
import { sendQuery, sendMutation } from 'ui/util/graphql';
import { GqlFile } from 'entities/GqlFile';
import { GqlSymbolInformation } from 'entities/GqlSymbolInformation';

export async function openFile(path: string, location?: GqlLocation) {
    const query = gql`
        query OpenFile($path: String!, $location: Location!) {
            openFile(path: $path, location: $location)
        }
    `;

    const results = await sendQuery<string>(query, {
        path,
        location: {
            startColumn: location?.start?.column,
            startLine: location?.start?.line,
            endColumn: location?.end?.column,
            endLine: location?.end?.line,
        },
    });

    return results;
}

export async function getFile(path: string) {
    const query = gql`
        query GetFile($path: String!) {
            getFile(path: $path) {
                filePath
                symbols {
                    name
                    filePath
                    kind
                    id
                    location {
                        start {
                            line
                            column
                        }
                        end {
                            line
                            column
                        }
                    }
                }
            }
        }
    `;

    const results = await sendQuery<{ getFile: GqlFile }>(query, {
        path,
    });

    return results.getFile;
}

export async function getActiveFile() {
    const query = gql`
        query GetActiveFile {
            getActiveFile {
                filePath
                symbols {
                    name
                    filePath
                    kind
                    id
                    location {
                        start {
                            line
                            column
                        }
                        end {
                            line
                            column
                        }
                    }
                }
            }
        }
    `;

    const results = await sendQuery<{ getActiveFile: GqlFile }>(query, {});

    return results.getActiveFile;
}

export async function getActiveSymbolForFile() {
    const query = gql`
        query GetActiveSymbolForFile {
            getActiveSymbolForFile {
                id
                name
                filePath
                kind
                location {
                    start {
                        line
                        column
                    }
                    end {
                        line
                        column
                    }
                }
            }
        }
    `;

    const results = await sendQuery<{
        getActiveSymbolForFile: GqlSymbolInformation;
    }>(query, {});

    return results.getActiveSymbolForFile;
}

export async function insertImport(symbol: string, path: string) {
    const mutation = gql`
        mutation InsertImport($symbol: String!, $path: String!) {
            insertImport(symbol: $symbol, path: $path)
        }
    `;

    const results = await sendMutation<any>(mutation, {
        symbol,
        path,
    });
    return {};
}
