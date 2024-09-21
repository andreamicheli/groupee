# Groupee - Project Documentation

## Overview

This project is a web application designed to facilitate group dynamics and project management through structured sessions. It comprises various models that represent the roles of hosts and clients, as well as backend functionality.

## Architecture Models
The application is structured around three key models: the **backend model**, the **host model**, and the **client model**. The **backend model** serves as the foundation for data management, encompassing session details, group settings, standard questions, and participant profiles. It efficiently handles the storage and organization of information, ensuring smooth operation across the platform. In contrast, the **host model** is designed specifically for facilitators, granting them control over session management, group configuration, and the ability to add customized questions. This model focuses on enabling hosts to create an engaging and structured environment for participants. On the other hand, the **client model** is tailored for individual participants, providing them with access to session information, the skill tree, and their roles within groups. While the backend model manages the overarching data structure, the host model empowers facilitators, and the client model enhances participant interaction, together they create a cohesive and dynamic user experience.


### FE Host Model

The **host model** is tailored for the session facilitator, allowing them to manage the overall group settings and monitor participant engagement.

```javascript
const hostModel = {
  mode: "host", // Indicates the current view mode (host or client)
  session: {
    roomId: String, // The ID of the room (used in QR code too)
    title: String, // The title of the group project
    currentPhase: null | "waiting" | Number | "tree" | "groups", // Current stage of the platform
    currentAnswers: null | Number, // Current number of people that have answered
  },
  groupSettings: {
    groupsNumber: "auto" | Number, // Total expected groups to create
    clientsInGroup: "auto" | Number, // Total expected participants for each group
    extraQuestions: [
      {
        title: String, // Title of the question
        type: "radio" | "checkbox" | "likert", // Type of the options
        diversify: Boolean, // If false, don't implement in the matchmaking algorithm
        options: [
          {
            text: String, // Option text
            value: "", // TODO
          },
        ],
      },
    ],
    followUp: "", // TODO. Optional
    certification: "", // TODO. Optional
    groups: null | [ [ { id: Number, name: String, surname: String } ] ], // Initially invalid list of groups
  },
```
## FE Host Model

```javascript
const hostModel = {
  mode: "host", // Indicates the current view mode (host or client)
  session: {
    roomId: String, // The ID of the room (used in QR code too)
    title: String, // The title of the group project
    currentPhase: null | "waiting" | Number | "tree" | "groups", // Current stage of the platform
    currentAnswers: null | Number, // Current number of people that have answered
  },
  groupSettings: {
    groupsNumber: "auto" | Number, // Total expected groups to create
    clientsInGroup: "auto" | Number, // Total expected participants for each group
    extraQuestions: [
      {
        title: String, // Title of the question
        type: "radio" | "checkbox" | "likert", // Type of the options
        diversify: Boolean, // If false, don't implement in the matchmaking algorithm
        options: [
          {
            text: String, // Option text
            value: "", // TODO
          },
        ],
      },
    ],
    followUp: "", // TODO. Optional
    certification: "", // TODO. Optional
    groups: null | [ [ { id: Number, name: String, surname: String } ] ], // Initially invalid list of groups
  },
};
```
## Backend Model

```javascript
const BE = {
  session: {
    roomId: String, // The ID of the room (used in QR code too)
    title: String, // The title of the group project
    currentPhase: null | "waiting" | Number | "tree" | "groups", // Current stage of the platform
    currentAnswers: null | Number, // Current number of people that have answered
  },
  groupSettings: {
    groupsNumber: "auto" | Number, // Total expected groups to create
    clientsInGroup: "auto" | Number, // Total expected participants for each group
    extraQuestions: [
      {
        title: String, // Title of the question
        type: "radio" | "checkbox" | "likert", // Type of the options
        diversify: Boolean, // If false, don't implement in the matchmaking algorithm
        options: [
          {
            text: String, // Option text
            value: "", // TODO
          },
        ],
      },
    ],
    followUp: "", // TODO. Optional
    certification: "", // TODO. Optional
  },
  standardQuestions: [
    {
      title: String, // Title of the question
      type: "radio" | "checkbox" | "likert", // Type of the options
      options: [
        {
          id: Number, // ID of the option
          text: String, // Option text
          value: "", // TODO
        },
      ],
    },
  ],
  clients: [
    {
      id: Number, // ID of the participant
      picture: String, // Path of the picture of the participant
      anagraphics: {
        name: String, // Name of the participant
        surname: String, // Surname of the participant
        phone: String | Number, // Phone number of the participant
        email: String, // Email of the participant
      },
      value: "", // TODO
      skillTree: null | [ { id: Number, name: String, description: String, connectionsId: [Number], icon: String } ], // Skill tree structure
      role: null | { title: String, description: String, image: String }, // Role structure
    },
  ],
  groups: null | [ [Number] ], // Initially invalid list of groups
};
```
