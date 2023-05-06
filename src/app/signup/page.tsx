"use client"
import React, { useState, useEffect, Suspense, useRef} from "react";
import { Auth } from "aws-amplify";
import { Amplify } from "aws-amplify";
import awsmobile from "../../aws-exports";
import { ISignUpResult } from "amazon-cognito-identity-js";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";
import ReCAPTCHA from "react-google-recaptcha";
import '@aws-amplify/ui-react/styles.css';


Amplify.configure(awsmobile);

const credentials = new AWS.Credentials({
accessKeyId: `${process.env.NEXT_PUBLIC_AWS_ACCESS_KEY}`,
secretAccessKey: `${process.env.NEXT_PUBLIC_AWS_SECRET_KEY}`,
});

const ddbDocClient = new AWS.DynamoDB.DocumentClient({
  region: "us-west-1",
  credentials,
});

const SignupForm: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isRecaptchaVerified, setRecaptchaVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string>('');

  const captchaRef = useRef<ReCAPTCHA>(null)



  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!isRecaptchaVerified) {
        console.log("Please complete the reCAPTCHA verification.");
        return;
      }
    
      // Verify reCAPTCHA token
      const token = await captchaRef.current?.executeAsync();
      if (!token) {
        console.log("Failed to verify reCAPTCHA token.");
        return;
      }

      const response = await fetch("/api/recaptcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("reCAPTCHA token verified.");
        captchaRef.current?.reset();
      } else {
        console.log("Failed to verify reCAPTCHA token.");
        return;
      }

      // Add user to Cognito user pool
      const { user }: ISignUpResult = await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          name: `${firstName} ${lastName}`,
          phone_number: phoneNumber,
        },
      });
      console.log("Successfully added user to Cognito User Pool");

      const verificationCode = window.prompt("Please enter the verification code you recieved via email.")
      if (!verificationCode) {
        console.log("Verification code is required.")
        return;
      }

      //confirm user's email address
      await Auth.confirmSignUp(email, verificationCode);
      console.log("successfully confirmed user's email address")

      // Add user to User table
      const params = {
        TableName: "User-dev",
        Item: {
          id: uuidv4().toString(),
          firstName,
          lastName,
          phoneNumber,
          email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      const data = await ddbDocClient.put(params).promise();
      console.log(data);
      console.log("Success - item added to DynamoDB table User");
    } catch (err) {
      console.log("Error", err);
    }
  };

  const handleRecaptchaChange = (token: string | null) => {
    if (token) {
      setRecaptchaVerified(true);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <form onSubmit={handleSignup}>
      <div>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstname"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          />
      </div>
      <div>
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastname"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="phone">Phone Number:</label>
        <input
          type="tel"
          id="phone"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
          ref={captchaRef}
          onChange={handleRecaptchaChange}
        />
      </div>
      <div>
        <button type="submit">Signup</button>
      </div>
    </form>
    </Suspense>
  );
};

export default (SignupForm);



