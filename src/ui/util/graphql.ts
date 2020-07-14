import { pipe, subscribe } from 'wonka';
import { getClient } from 'common/graphql';
import { createRequest } from 'urql';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export function sendQuery<T>(query: DocumentNode, variables: object) {
    const client = getClient(undefined);

    return new Promise<T>((resolve, reject) => {
        pipe(
            client.executeQuery(createRequest(query, variables)) as any,
            subscribe(({ data, error }: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            })
        );
    });
}

export function sendMutation<T>(query: DocumentNode, variables: object) {
    const client = getClient(undefined);

    return new Promise<T>((resolve, reject) => {
        pipe(
            client.executeMutation(createRequest(query, variables)) as any,
            subscribe(({ data, error }: any) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    resolve(data);
                }
            })
        );
    });
}

export function listenToMessages<T>(callBack: (eventName: string) => void) {
    const client = getClient(undefined);

    const subscription = gql`
        subscription {
            events
        }
    `;

    pipe(
        client.executeSubscription(createRequest(subscription)) as any,
        subscribe(({ data, error }: any) => {
            callBack(data.events);
        })
    );
}
