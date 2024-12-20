export const getAll = (req, res) => {
    const {phone} = req.params
    console.log('Se obtienen todos los mensajes de: ' + phone)
    res.send('Ok')
}

export const insert = (req, res) => {
    console.log('Se insertan los mensajes')
    //req.body
    res.send('Ok')
}

export const remove = (req, res) => {
    const {id} = req.params
    console.log('Se eliminó el mensaje: ' + id)
    res.send('Ok')
}