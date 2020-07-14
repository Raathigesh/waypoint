import SourceFile from './SourceFile';

process.on('message', async workerData => {
    for (const file of workerData.files) {
        const sourceFile = new SourceFile();
        const parseResult = await sourceFile.parse(
            file,
            workerData.pathAlias,
            workerData.root
        );
        (process as any).send(parseResult);
    }
    process.exit(0);
});
