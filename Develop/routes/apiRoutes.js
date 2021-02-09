var path = require('path')
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
let dbJSON = require('../db/db.json');

module.exports = function(app) {
    
    app.get('/api/notes', function(req, res) {
        res.send(dbJSON);
    });

    app.post('/api/notes', function (req, res){
        if(!req.body.title) {
            return res.json({error: 'Missing required title'});
        }

        const note = {...req.body, id: uuidv4()}

        dbJSON.push(note);

        fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(dbJSON), (err) => {
            if (err) {
                return res.json({error: 'Error writing to file.'})
            }
            
            return res.json(note);
        })
    });

    app.delete('/api/notes/:id', function (req, res){
        let noteId = req.params.id;
        let newNotes = dbJSON.filter(note => note.id !== noteId)
        dbJSON = newNotes;
        
        fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(dbJSON), (err) => {
            if (err) {
                return res.json({error: 'Error writing to file.'})
            }
            
            return res.json(newNotes);
        })

    })
}