import gql from 'graphql-tag';
import { sendQuery, sendMutation } from 'ui/util/graphql';
import { BookmarksJSON } from '../models/bookmarks';
import { PreferenceJSON } from '../models/Preference';

export async function setPathMap(pathMap: string) {
    const query = gql`
        mutation SetPathMap($value: String!) {
            setPathMap(value: $value)
        }
    `;

    await sendMutation(query, {
        value: pathMap,
    });
}

export async function getPathMap() {
    const query = gql`
        query {
            getPathMap
        }
    `;

    const result = await sendQuery<{ getPathMap: string }>(query, {});
    return result.getPathMap;
}

export async function setPreference(preference: PreferenceJSON) {
    const query = gql`
        mutation SetPreference($value: String!) {
            setPreference(value: $value)
        }
    `;

    await sendMutation(query, {
        value: JSON.stringify(preference),
    });
}

export async function getPreference() {
    const query = gql`
        query {
            getPreference
        }
    `;

    const result = await sendQuery<{ getPreference: string }>(query, {});
    return JSON.parse(result.getPreference);
}

export async function setDirectories(directories: string[]) {
    const query = gql`
        mutation SetDirectories($value: String!) {
            setDirectories(value: $value)
        }
    `;

    await sendMutation(query, {
        value: JSON.stringify(directories),
    });
}

export async function getDirectories() {
    const query = gql`
        query {
            getDirectories
        }
    `;

    const result = await sendQuery<{ getDirectories: string }>(query, {});
    return JSON.parse(result.getDirectories) as string[];
}

export async function setBookmarksConfig(stage: BookmarksJSON[]) {
    const query = gql`
        mutation SetBookmarksConfig($value: String!) {
            setBookmarksConfig(value: $value)
        }
    `;

    await sendMutation(query, {
        value: JSON.stringify(stage),
    });
}

export async function getBookmarksConfig() {
    const query = gql`
        query {
            getBookmarksConfig
        }
    `;

    const result = await sendQuery<{ getBookmarksConfig: string }>(query, {});
    return result.getBookmarksConfig
        ? (JSON.parse(result.getBookmarksConfig) as BookmarksJSON[])
        : [];
}
