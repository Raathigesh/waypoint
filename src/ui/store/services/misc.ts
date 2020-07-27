import gql from 'graphql-tag';
import { sendMutation } from 'ui/util/graphql';

export async function openURL(url: string) {
    const mutation = gql`
        mutation OpenURL($url: String!) {
            openURL(url: $url)
        }
    `;

    const results = await sendMutation<{ openURL: string }>(mutation, {
        url,
    });
    return results.openURL;
}
