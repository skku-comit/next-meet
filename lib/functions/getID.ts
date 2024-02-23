// idType
// 1: member(user), 2: non-member, 3: event
const getID = (idType: number) => 
{    
    let id: number = 0;
    const head = idType;
    const dateNum = new Date().getTime();
    const temp = `${head}${dateNum}`;
    id = parseInt(temp);

    return id;
}

export default getID;