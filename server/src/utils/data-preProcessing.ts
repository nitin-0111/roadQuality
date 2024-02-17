interface InputData {
    x: number;
    y: number;
    z: number;
}

interface OutputData {
    ax_prime: number;
    ay_prime: number;
    az_prime: number;
}

function Data_preprocess(inputData: InputData): OutputData {
    const { x, y, z } = inputData;

    // Calculate alpha and beta
    const alpha: number = Math.atan2(y, Math.sqrt(x ** 2 + z ** 2));
    const beta: number = Math.atan2(-x, Math.sqrt(y ** 2 + z ** 2));

    // Perform operations
    const ax_prime: number = Math.cos(beta) * x + Math.sin(beta) * Math.sin(alpha) * y + Math.cos(alpha) * Math.sin(beta) * z;
    const ay_prime: number = Math.cos(alpha) * y - Math.sin(alpha) * z;
    const az_prime: number = -Math.sin(beta) * x + Math.cos(beta) * Math.sin(alpha) * y + Math.cos(alpha) * Math.cos(beta) * z;

    return { ax_prime, ay_prime, az_prime };
}
export default Data_preprocess;
