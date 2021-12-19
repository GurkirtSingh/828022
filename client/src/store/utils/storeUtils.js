// sorting messages by createdAt
export const sortMessages = (messages) => {
    return messages.slice(0).reverse().sort(function(first,second){
        return first.createdAt - second.createdAt
    })
}
