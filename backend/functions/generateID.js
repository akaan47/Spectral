function generateID(inType) {
    const currentYear = new Date().getFullYear();
    const prefix = currentYear - 2024;

    let type;
    switch (inType) {
        case "user": type = 1; break;
        case "group": type = 2; break;
        case "message": type = 3; break;
        default: throw new Error("Invalid type");
    }

    const now = Date.now() % 1000000;
    
    const randomPart = Math.floor(Math.random() * 1000);
    
    const uniqueId = `${type}${prefix}${now.toString().padStart(6, '0')}${randomPart.toString().padStart(3, '0')}`;
    
    return uniqueId;
}

module.exports = generateID;