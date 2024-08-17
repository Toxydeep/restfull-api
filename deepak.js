const express=require("express");
const users=require('../../MOCK_DATA.json');
const fs=require('fs');
const app=express();
const port=4000;
//middleware
app.use(express.urlencoded({extended:false}));

app.get('/users',(req,res)=>{
  const html=`<ul>
      ${users.map((user)=>`<li>${user.first_name}</li>`).join("")}
  </ul>
  `;res.send(html);
})
//resrfull api routes

app.get('/api/users',(req,res)=>{
  return res.json(users);
}) 
app.get('/api/users/:id',(req,res)=>{
  const id=Number(req.params.id);
  const user=users.find((user)=>user.id===id);
  return res.json(user);
})
app.post('/api/users',(req,res)=>{
  const body=req.body;
  users.push({...body,id:users.length+1});
  fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
    console.log("body",body);
    return res.json({status:"pending"});
  });
})
app.patch('/api/users/patch', (req, res) => {
  const queryParams = req.query; // Extract query parameters from the request
  const userId = parseInt(queryParams.id); // Assuming 'id' is provided in the query parameters
  if (!userId) {
      return res.status(400).json({error: 'User ID is required in the query parameters'});
  }

  // Find the index of the user with the given ID
  const userIndex = users.findIndex(user => user.id === userId);

  // If user not found, return error
  if (userIndex === -1) {
      return res.status(404).json({error: 'User not found'});
  }

  // Update user data with the new information from query parameters
  users[userIndex] = {...users[userIndex], ...queryParams};

  // Write updated user data to file
  fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
      if (err) {
          console.error('Error writing to file:', err);
          return res.status(500).json({error: 'Internal Server Error'});
      }
      return res.json({status: 'success', id: userId});
  });
});


app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id); // Parse ID from request params

  // Find the index of the user with the given ID
  const userIndex = users.findIndex(user => user.id === userId);

  // If user not found, return error
  if (userIndex === -1) {
      return res.status(404).json({error: 'User not found'});
  }

  // Remove the user with the specified ID from the array
  users.splice(userIndex, 1);

  // Write updated user data to file
  fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
      if (err) {
          console.error('Error writing to file:', err);
          return res.status(500).json({error: 'Internal Server Error'});
      }
      return res.json({status: 'success', id: userId});
  });
});


app.listen(port,()=>console.log(` server is started${port}`));