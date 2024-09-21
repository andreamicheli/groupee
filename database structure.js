const hostModel = {
  mode: "host", //if the view is currently host or client. Maybe not need if using a path?
  //general information of the session
  session: {
    roomId: String, //the id of the room (used in QR code too)
    title: String, //the title of the group project
    currentPhase: null | "waiting" | Number | "tree" | "groups", //current stage of the platform (null=landing page and settings, waiting=waiting room with QR, #Number=number of the question (id), tree=global tree view, group=group division view)
    currentAnswers: null | Number, //current number of people that have answered
  },
  //settings for the group created. groupsNumber & clientsInGroup Can't be both "auto"
  groupSettings: {
    groupsNumber: "auto" | Number, //the number of total expected groups to create
    clientsInGroup: "auto" | Number, //the number of total expected participants for each group
    extraQuestions: [
      //list of additional customized questions added by the host. Optional
      {
        title: String, //title of the question
        type: "radio" | "checkbox" | "likert", //type of the options (radio=single answer, checkbox=multiple answer, likert=likert scale)
        diversify: Boolean, //if false, don't implement in the matchmaking algorithm, present just for feedback scopes
        options: [
          {
            text: String, //
            value: "", //TODO
          },
        ],
      },
    ],
    followUp: "", //TODO. Optional
    certification: "", //TODO. Optional
    groups:
      null |
      [
        //initially invalid list of groups
        [
          {
            id: Number, //id of member
            name: String, //name of member
            surname: String, //name of member
          },
        ], //table of client ids
      ],
  },
};

const clientModel = {
  mode: "client", //if the view is currently host or client. Maybe not need if using a path?
  //general information of the session
  session: {
    roomId: String, //the id of the room (used in QR code too)
    currentPhase: null | "waiting" | Number | "tree" | "groups", //current stage of the platform (null=landing page and settings, waiting=waiting room with QR, #Number=number of the question (id), tree=global tree view, group=group division view)
  },
  //settings for the group created. groupsNumber & clientsInGroup Can't be both "auto"
  groupSettings: {
    extraQuestions: [
      //list of additional customized questions added by the host. Optional
      {
        title: String, //title of the question
        type: "radio" | "checkbox" | "likert", //type of the options (radio=single answer, checkbox=multiple answer, likert=likert scale)
        diversify: Boolean, //if false, don't implement in the matchmaking algorithm, present just for feedback scopes
        options: [
          {
            text: String, //
            value: "", //TODO
          },
        ],
      },
    ],
    followUp: "", //TODO. Optional
    certification: "", //TODO. Optional
  },
  standardQuestions: [
    {
      title: String, //title of the question
      type: "radio" | "checkbox" | "likert", //type of the options (radio=single answer, checkbox=multiple answer, likert=likert scale)
      options: [
        {
          id: Number, //id of the option
          text: String, //
          value: "", //TODO
        },
      ],
    },
  ],
  //structure of the tree
  skillTree:
    null |
    [
      {
        //initially invalid tree structure (connections/children)
        id: Number, //id of the skill
        name: String, //name of the skill
        description: String, //description of the skill
        connectionsId: [Number], //ids of the connected skills, or, for another approach:
        //childrens: [{ // recursive children approach, top-down tree with branches
        // id: Number,
        // name: String,
        // description: String,
        // connectionsId: [Number],
        //childrens: [...] //recursive list of childrens
        // }, {...}]
        icon: String, //path of the icon of the specific skill
      },
    ],
  //structure of the role
  role:
    null |
    {
      //initially invalid role with specifics
      title: String, //title of the role
      description: String, //description of the role
      image: String, //path for the image of the role
    },
  group: [
    {
      id: Number, //id of the participant member of the group
      image: String, //id of the participant member of the group
      anagraphics: {
        //basic contact information of the participant member of the group
        name: String, //name of the participant member of the group
        surname: String, //surname of the participant member of the group
        phone: String | Number, //phone number of the participant member of the group
        email: String, //email of the participant member of the group
      },
      role: Object, //role object (see above) of the participant member
      description: String, //description of the role
      skillTree: Object, //skill tree object (see above) of the participant member
    },
  ],
};

const BE = {
  //general information of the session
  session: {
    roomId: String, //the id of the room (used in QR code too)
    title: String, //the title of the group project
    currentPhase: null | "waiting" | Number | "tree" | "groups", //current stage of the platform (null=landing page and settings, waiting=waiting room with QR, #Number=number of the question (id), tree=global tree view, group=group division view)
    currentAnswers: null | Number, //current number of people that have answered
  },
  //settings for the group created. groupsNumber & clientsInGroup Can't be both "auto"
  groupSettings: {
    groupsNumber: "auto" | Number, //the number of total expected groups to create
    clientsInGroup: "auto" | Number, //the number of total expected participants for each group
    extraQuestions: [
      //list of additional customized questions added by the host. Optional
      {
        title: String, //title of the question
        type: "radio" | "checkbox" | "likert", //type of the options (radio=single answer, checkbox=multiple answer, likert=likert scale)
        diversify: Boolean, //if false, don't implement in the matchmaking algorithm, present just for feedback scopes
        options: [
          {
            text: String, //
            value: "", //TODO
          },
        ],
      },
    ],
    followUp: "", //TODO. Optional
    certification: "", //TODO. Optional
  },
  //list of the standard personality questions
  standardQuestions: [
    {
      title: String, //title of the question
      type: "radio" | "checkbox" | "likert", //type of the options (radio=single answer, checkbox=multiple answer, likert=likert scale)
      options: [
        {
          id: Number, //id of the option
          text: String, //
          value: "", //TODO
        },
      ],
    },
  ],
  clients: [
    //list of the participants
    {
      id: Number, //id of the participant
      picture: String, //path of the picture of the participant
      anagraphics: {
        //basic contact information of the participant
        name: String, //name of the participant
        surname: String, //surname of the participant
        phone: String | Number, //phone number of the participant
        email: String, //email of the participant
      },
      // answers: [{id: String}], //not necessary since the value of the answer is sent from FE to BE instead of the specific selected option
      value: "", //TODO
      skillTree:
        null |
        [
          {
            //initially invalid tree structure (connections/children)
            id: Number, //id of the skill
            name: String, //name of the skill
            description: String, //description of the skill
            connectionsId: [Number], //ids of the connected skills, or, for another approach:
            //childrens: [{ // recursive children approach, top-down tree with branches
            // id: Number,
            // name: String,
            // description: String,
            // connectionsId: [Number],
            //childrens: [...] //recursive list of childrens
            // }, {...}]
            icon: String, //path of the icon of the specific skill
          },
        ],
      role:
        null |
        {
          //initially invalid role with specifics
          title: String, //title of the role
          description: String, //description of the role
          image: String, //path for the image of the role
        },
    },
  ],
  groups:
    null |
    [
      //initially invalid list of groups
      [Number], //table of client ids
    ],
};
