import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import * as vscode from 'vscode';
const Conf = require('conf');
import { Service } from 'typedi';
import { ParseResult } from 'indexer/SourceFile';

@Resolver()
@Service()
export default class ConfigResolver {
    private conf = new Conf({
        projectName: 'Insight',
        projectVersion: 1,
    });

    private inMemoryStorage: { [key: string]: any } = {};

    shouldUseInMemoryStorage() {
        return process.env.useInMemoryStorage;
    }

    set(key: string, value: any) {
        if (this.shouldUseInMemoryStorage()) {
            this.inMemoryStorage[key] = value;
            return;
        }

        this.conf.set(key, value);
    }

    get(key: string) {
        if (this.shouldUseInMemoryStorage()) {
            return this.inMemoryStorage[key];
        }

        return this.conf.get(key);
    }

    getKeyForPathMaps() {
        return `pathMaps.${vscode.workspace.rootPath}`;
    }

    @Mutation(returns => String)
    public reset() {
        if (this.shouldUseInMemoryStorage()) {
            this.inMemoryStorage = {};
        }
    }

    @Mutation(returns => String)
    public setPathMap(@Arg('value') value: string) {
        this.set(this.getKeyForPathMaps(), value);
        return '';
    }

    @Query(returns => String)
    public getPathMap() {
        return this.get(this.getKeyForPathMaps()) || '';
    }

    getKeyForPreference() {
        return `preference.${vscode.workspace.rootPath}`;
    }

    @Mutation(returns => String)
    public setPreference(@Arg('value') value: string) {
        this.set(this.getKeyForPreference(), value);
        return '';
    }

    @Query(returns => String)
    public getPreference() {
        return this.get(this.getKeyForPreference()) || '{}';
    }

    getKeyForDirectories() {
        return `directories.${vscode.workspace.rootPath}`;
    }

    @Mutation(returns => String)
    public setDirectories(@Arg('value') value: string) {
        this.set(this.getKeyForDirectories(), value);
        return '';
    }

    @Query(returns => String)
    public getDirectories() {
        return this.get(this.getKeyForDirectories()) || '[]';
    }

    getKeyForBookmarksConfig() {
        return `bookmarks.${vscode.workspace.rootPath}`;
    }

    @Mutation(returns => String)
    public setBookmarksConfig(@Arg('value') value: string) {
        this.set(this.getKeyForBookmarksConfig(), value);
        return '';
    }

    @Query(returns => String, { nullable: true })
    public getBookmarksConfig() {
        return this.get(this.getKeyForBookmarksConfig()) || null;
    }

    getKeyForCache() {
        return `cache.${vscode.workspace.rootPath}`;
    }

    public setCache(value: { [path: string]: ParseResult }) {
        this.set(this.getKeyForCache(), value);
        return '';
    }

    public getCache() {
        return this.get(this.getKeyForCache()) || null;
    }
}
