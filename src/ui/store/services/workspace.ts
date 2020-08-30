import gql from 'graphql-tag';
import { sendQuery } from 'ui/util/graphql';

export async function getAllOpenTextDocuments() {
    const query = gql`
        query {
            getAllOpenTextDocuments
        }
    `;

    const result = await sendQuery<{ getAllOpenTextDocuments: string[] }>(
        query,
        {}
    );
    return result.getAllOpenTextDocuments;
}
