await new Promise((resolve, reject) => {
    ffmpeg(stream)
        .inputFormat(videoType)
        .on('error', reject)
        .on('end', () => resolve(true))
        .addOutputOptions([
            '-vcodec',
            'libwebp',
            '-vf',
            // eslint-disable-next-line no-useless-escape
            'scale=\'iw*min(300/iw\,300/ih)\':\'ih*min(300/iw\,300/ih)\',format=rgba,pad=300:300:\'(300-iw)/2\':\'(300-ih)/2\':\'#00000000\',setsar=1,fps=10',
            '-loop',
            '0',
            '-ss',
            '00:00:00.0',
            // '-t', comentando a limitação de tempo
            // '00:00:05.0',
            '-preset',
            'default',
            '-an',
            '-vsync',
            '0',
            '-s',
            '512:512',
            '-fs',
            '1000000' //adicionando limitação de tamanho
        ])
        .toFormat('webp')
        .save(tempFile);
});