export const getAll = (req, res) => {
    console.log('Obteniendo todos los contactos')
    console.log(req.user)
    res.send('Ok')
}

export const getById = (req, res) => {
    const {id} = req.params
    console.log('Obteniendo contacto con id: ' + id)
    res.send('Ok')
}

export const insert = (req, res) => {
    console.log('Insertando un contacto')
    console.log(req.body)
    res.send('Ok')
}

export const update = (req, res) => {
    const {id} = req.params
    console.log('Actualizando el contacto: ' + id)
    //req.body
    res.send('Ok')
}

export const remove = (req, res) => {
    const {id} = req.params
    console.log('Eliminando el contacto: ' + id)
    res.send('Ok')
}