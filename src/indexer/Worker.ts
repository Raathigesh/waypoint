import SourceFile from './SourceFile';

process.on('message', async workerData => {
    for (const file of workerData.files) {
        const sourceFile = new SourceFile(
            file,
            workerData.pathAlias,
            workerData.root
        );
        const parseResult = await sourceFile.parse();
        (process as any).send(parseResult);
    }
    process.exit(0);
});
