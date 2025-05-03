const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/Files', express.static(path.join(__dirname, 'Files')));



app.get('/',(req,res)=>{
    fs.readdir("./Files",(err,files)=>{
        if(err){
            console.log(err);
            return res.status(500).send('Internal Server Error');
        }
        res.render('index',{ documents: files});
    })
});


//post file
app.post('/upload',(req,res)=>{
    fs.writeFile(`./Files/${req.body.filename.split(' ').join('')}.txt`,req.body.filetext,(err)=>{
        if(err){
            console.log(err);
            return res.status(500).send('Internal Server Error');
        }
        else{
            console.log('File Created');
            res.redirect('/');
        }
        
    })
});


//delete all files
app.post('/delete',(req,res)=>{
    fs.readdir("./Files",( err, files)=>{
        if(err){
            console.log(err);
            return res.status(500).send('Internal Server Error');
        }
        else{
            files.forEach((file)=>{
                fs.unlink(path.join(__dirname,'Files',file),(err)=>{
                    if(err){
                        console.log(`Error deleting ${file}`);
                    }
                })
            })

            console.log("All Files deleted successfully");
            res.redirect("/");
        }
    })
})

app.get('/read/:filename',(req,res)=>{
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'Files', filename);
    
    

    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }
        res.render("readdata", { 
            filename: filename,
            content: data 
        });
    });
})


app.all('*',(req,res)=>{
    res.status(404).send('404 Not Found');
});

app.listen(6900,()=>{
    console.log('Server is running on port 6900');
});