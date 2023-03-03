import { User } from "../models/user.js";
import { Child} from "../models/child.js";
import { Application } from "../models/application.js";
import { application } from "express";





export async function linkChild(req, res) {
  let child = await Child.findOne({ BuildId: req.body.BuildId });

  if (child) {
    console.log("child exists")
    User.findById(req.id)
      .then(async (user) => {
        user.Children.push(child._id);

        if (!child.Parents.includes(user._id)) {
          child.Parents.push(user._id);
          child.Linked = true;
        }

        await Promise.all([child.save(), user.save()]);

        res.status(200).json("Child linked");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ "error": "Error linking child" });
      });
  } else {
    console.log("doesnt exists");
    const user = await User.findById(req.id);

    const newChild = await Child.create({
      Name: req.body.Name,
      BuildId: req.body.BuildId,
      Linked: true,
      Parents: [user._id],
    });

    user.Children.push(newChild._id);
    await user.save();

    res.status(200).json("Child created and linked");
  }
}
export async function getChildrenByParent(req,res){
  let user = await User.findOne({ _id: req.id });
  await Child
  .find({ Parents: user._id})
  .then(docs => {
      res.status(200).json(docs)
  })
  .catch(err => {
      res.status(500).json({ error: err });
  });

}
export async function addApplicationToChild(req,res){
  let child=await Child.findById(req.body.id).populate("applications")
  var application=new Application()
    application.Name=req.body.name
    application.child=child._id

    await Child.findOneAndUpdate({_id:req.body.id},
        {
          $push:{
            applications:application._id,
          }
        } 
      )
    await application.save();
    res.status(200).send(child)

  
  
}

export async function getApplicationByChild(req, res) {
  console.log(req.body.id);
  try {
    let child = await Child.findOne({ id: req.body.id }).populate('applications');
    if (child) {
      res.status(200).json(child.applications);
    } else {
      res.status(404).send("Child Not Found!!");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

export async function blockApplication(req,res){
  console.log("blocking");
  await Application.findOneAndUpdate({_id:req.body.id}, {
    blocked: req.body.blocked,
  }).then(docs=>{
    res.status(200).json(docs)
  }).catch(err=>{
    res.status(500).send("Failed to block App")
  })
}


export async function unlinkChild(req,res){}