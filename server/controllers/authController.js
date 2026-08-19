import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as User from '../models/User.js';

const REL = ['Myself','Child','Parent','Sibling','Spouse','Other'];

function safeUser(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    relationship: u.relationship,
    patient: {
      name: u.patientName,
      age: u.age,
      gender: u.gender,
      bloodGroup: u.bloodGroup,
      phone: u.phone,
      address: u.address
    },
    createdAt: u.createdAt
  };
}

function issue(u) {
  return jwt.sign({userId: String(u.id)}, process.env.JWT_SECRET, {expiresIn:'7d'});
}

export async function register(req,res) {
  try {
    const {name,email,password,confirmPassword,relationship,patientName,age,gender,bloodGroup,phone,address} = req.body;
    if(!name||!email||!password||!confirmPassword||!relationship||!patientName||age===undefined||!gender||!bloodGroup||!phone||!address)
      return res.status(400).json({error:'All account and patient fields are required.'});
    if(!REL.includes(relationship)) return res.status(400).json({error:'Invalid relationship.'});
    if(password.length<6) return res.status(400).json({error:'Password must be at least 6 characters.'});
    if(password!==confirmPassword) return res.status(400).json({error:'Passwords do not match.'});
    if(!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({error:'Invalid email address.'});
    if(Number(age)<0||Number(age)>130) return res.status(400).json({error:'Invalid patient age.'});

    const normalizedEmail = email.toLowerCase().trim();
    if(await User.existsByEmail(normalizedEmail))
      return res.status(400).json({error:'Email is already registered.'});

    const u = await User.create({
      name, email: normalizedEmail,
      passwordHash: await bcrypt.hash(password,12),
      relationship,
      patient: {name:patientName, age:Number(age), gender, bloodGroup, phone, address}
    });

    res.cookie('access_token',issue(u),{
      httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',
      maxAge:7*24*60*60*1000
    });
    res.status(201).json({message:'Registration successful.',user:safeUser(u)});
  } catch(e) {
    res.status(500).json({error:'Failed to create account.',details:e.message});
  }
}

export async function login(req,res) {
  try {
    const u = await User.findByEmail(req.body.email?.toLowerCase().trim());
    if(!u || !(await bcrypt.compare(req.body.password||'',u.passwordHash)))
      return res.status(401).json({error:'Invalid email or password.'});
    res.cookie('access_token',issue(u),{
      httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',
      maxAge:7*24*60*60*1000
    });
    res.json({message:'Login successful.',user:safeUser(u)});
  } catch(e) {
    res.status(500).json({error:'Login failed.',details:e.message});
  }
}

export function logout(req,res) {
  res.clearCookie('access_token');
  res.json({message:'Logged out successfully.'});
}

export function me(req,res) {
  res.json({user:safeUser(req.user)});
}
