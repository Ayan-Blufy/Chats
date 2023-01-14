import React, { useState, useEffect } from "react";

import Robot from "../assets/robot.gif";
export default function Welcome({ user }) {

    return (
        <div className="container text">
            <img src={Robot} alt="" />
            <h1>
                Welcome, <span>{user?.name}!</span>
            </h1>
            <h3>Please select a chat to Start messaging.</h3>
        </div>
    );
}

