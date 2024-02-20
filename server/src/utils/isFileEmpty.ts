import fs from 'fs';

async function isFileEmpty(fileName: string): Promise<boolean> {
    try {
        await fs.promises.access(fileName, fs.constants.F_OK); // Check if file exists
        const data = await fs.promises.readFile(fileName, 'utf8');
        return data.trim().length === 0; // Check if file is empty
    } catch (err) {
        return true; // Consider file as empty if an error occurs or it doesn't exist
    }
}

export default isFileEmpty;
