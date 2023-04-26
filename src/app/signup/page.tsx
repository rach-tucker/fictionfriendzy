"use client"
import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { Amplify } from 'aws-amplify';
import awsmobile from '../../aws-exports';
import { ISignUpResult } from "amazon-cognito-identity-js";
import { v4 as uuidv4 } from 'uuid';
import AWS, { Credentials } from "aws-sdk";

Amplify.configure(awsmobile);

const credentials = new AWS.Credentials({
  accessKeyId: `${process.env.NEXT_PUBLIC_AWS_ACCESS_KEY}`,
  secretAccessKey: `${process.env.NEXT_PUBLIC_AWS_SECRET_KEY}`,
});

const ddbDocClient = new AWS.DynamoDB.DocumentClient({
  region: "us-west-1",
  credentials,
});

interface SignupFormProps {
  onSuccess: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault(); 
    try {
      const { user }: ISignUpResult = await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          name: `${firstName} ${lastName}`,
          phone_number: phoneNumber,
        },
      });
      const params = {
        TableName: "User-dev",
        Item: {
          id: uuidv4().toString(), // generate a unique id as a string
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
          email: email,
          createdAt: new Date().toISOString(), // add current timestamp
          updatedAt: new Date().toISOString(),
        },
      };

      const data = await ddbDocClient.put(params).promise();
      console.log(data);
      console.log("Success - item added to DynamoDB table User");
      onSuccess();
    } catch (err) {
      console.log("Error", err);
    }
  };

  return (
    <form onSubmit={handleSignup}>
    <div>
    <label htmlFor="firstName">First Name:</label>
      <input type="text" id="firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
    </div>
    <div>
    <label htmlFor="lastName">Last Name:</label>
    <input type="text" id="lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} />
    </div>
    <div>
    <label htmlFor="email">Email:</label>
    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
    </div>
    <div>
    <label htmlFor="phone">Phone Number:</label>
    <input type="tel" id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
    </div>
    <div>
    <label htmlFor="password">Password:</label>
    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
    </div>

      <button type="submit">Signup</button>
    </form>
  );
};

export default SignupForm;
