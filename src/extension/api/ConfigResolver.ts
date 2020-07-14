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

    getKeyForPathMaps() {
        return `pathMaps.${vscode.workspace.rootPath}`;
    }

    @Mutation(returns => String)
    public setPathMap(@Arg('value') value: string) {
        this.conf.set(this.getKeyForPathMaps(), value);
        return '';
    }

    @Query(returns => String)
    public getPathMap() {
        return this.conf.get(this.getKeyForPathMaps()) || '';
    }

    getKeyForPreference() {
        return `preference.${vscode.workspace.rootPath}`;
    }

    @Mutation(returns => String)
    public setPreference(@Arg('value') value: string) {
        this.conf.set(this.getKeyForPreference(), value);
        return '';
    }

    @Query(returns => String)
    public getPreference() {
        return this.conf.get(this.getKeyForPreference()) || '{}';
    }

    getKeyForDirectories() {
        return `directories.${vscode.workspace.rootPath}`;
    }

    @Mutation(returns => String)
    public setDirectories(@Arg('value') value: string) {
        this.conf.set(this.getKeyForDirectories(), value);
        return '';
    }

    @Query(returns => String)
    public getDirectories() {
        return this.conf.get(this.getKeyForDirectories()) || '[]';
    }

    getKeyForBookmarksConfig() {
        return `bookmarks.${vscode.workspace.rootPath}`;
    }

    @Mutation(returns => String)
    public setBookmarksConfig(@Arg('value') value: string) {
        this.conf.set(this.getKeyForBookmarksConfig(), value);
        return '';
    }

    @Query(returns => String, { nullable: true })
    public getBookmarksConfig() {
        return this.conf.get(this.getKeyForBookmarksConfig()) || null;
    }

    getKeyForCache() {
        return `cache.${vscode.workspace.rootPath}`;
    }

    public setCache(value: { [path: string]: ParseResult }) {
        this.conf.set(this.getKeyForCache(), value);
        return '';
    }

    public getCache() {
        return this.conf.get(this.getKeyForCache()) || null;
    }
}
