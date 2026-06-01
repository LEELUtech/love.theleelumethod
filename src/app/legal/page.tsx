export const metadata = { title: "Legal | The Leelu Method" };

import Header from '@/components/ui/Header';

type Block =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'h3'; text: string }
  | { type: 'em'; text: string };

type Section = {
  title: string;
  blocks: Block[];
};

type Document = {
  heading: string;
  date?: string;
  intro?: Block[];
  sections: Section[];
};

const documents: Document[] = [
  {
    heading: 'Privacy Policy',
    date: 'Last updated May 30, 2026',
    intro: [
      { type: 'p', text: 'This Privacy Notice for The Leelu Method ("we," "us," or "our") describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you:' },
      { type: 'ul', items: [
        'Visit our website or any website of ours that links to this Privacy Notice',
        'Engage with us in other related ways, including any sales, marketing, or events',
      ]},
      { type: 'p', text: 'Questions or concerns? Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at support@theleelumethod.com.' },
    ],
    sections: [
      {
        title: 'SUMMARY OF KEY POINTS',
        blocks: [
          { type: 'p', text: 'This summary provides key points from our Privacy Notice. You can find more details by using the table of contents below.' },
          { type: 'h3', text: 'What personal information do we process?' },
          { type: 'p', text: 'When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the choices you make. We only collect your name, phone number, and email address.' },
          { type: 'h3', text: 'Do we process any sensitive personal information?' },
          { type: 'p', text: 'We do not process sensitive personal information.' },
          { type: 'h3', text: 'Do we collect any information from third parties?' },
          { type: 'p', text: 'We do not collect any information from third parties.' },
          { type: 'h3', text: 'How do we process your information?' },
          { type: 'p', text: 'We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so.' },
          { type: 'h3', text: 'How do we keep your information safe?' },
          { type: 'p', text: 'We have adequate organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.' },
          { type: 'h3', text: 'What are your rights?' },
          { type: 'p', text: 'Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.' },
          { type: 'h3', text: 'How do you exercise your rights?' },
          { type: 'p', text: 'The easiest way to exercise your rights is by contacting us at support@theleelumethod.com. We will consider and act upon any request in accordance with applicable data protection laws.' },
        ],
      },
      {
        title: 'TABLE OF CONTENTS',
        blocks: [
          { type: 'ul', items: [
            '1. WHAT INFORMATION DO WE COLLECT?',
            '2. HOW DO WE PROCESS YOUR INFORMATION?',
            '3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?',
            '4. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?',
            '5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?',
            '6. HOW LONG DO WE KEEP YOUR INFORMATION?',
            '7. HOW DO WE KEEP YOUR INFORMATION SAFE?',
            '8. DO WE COLLECT INFORMATION FROM MINORS?',
            '9. WHAT ARE YOUR PRIVACY RIGHTS?',
            '10. CONTROLS FOR DO-NOT-TRACK FEATURES',
            '11. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?',
            '12. DO WE MAKE UPDATES TO THIS NOTICE?',
            '13. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?',
            '14. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?',
          ]},
        ],
      },
      {
        title: '1. WHAT INFORMATION DO WE COLLECT?',
        blocks: [
          { type: 'h3', text: 'Personal information you disclose to us' },
          { type: 'em', text: 'In Short: We collect personal information that you provide to us.' },
          { type: 'p', text: 'We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.' },
          { type: 'p', text: 'Personal Information Provided by You. The personal information we collect may include the following:' },
          { type: 'ul', items: ['names', 'phone numbers', 'email addresses'] },
          { type: 'p', text: 'All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.' },
          { type: 'h3', text: 'Information automatically collected' },
          { type: 'em', text: 'In Short: Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Services.' },
          { type: 'p', text: 'We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.' },
          { type: 'p', text: 'Like many businesses, we also collect information through cookies and similar technologies. The information we collect includes:' },
          { type: 'ul', items: [
            'Log and Usage Data. Log and usage data is service-related, diagnostic, usage, and performance information our servers automatically collect when you access or use our Services and which we record in log files. This log data may include your IP address, device information, browser type, and settings, as well as information about your activity in the Services.',
            'Device Data. We collect device data such as information about your computer, phone, tablet, or other device you use to access the Services, including your IP address, browser type, and operating system.',
            'Location Data. We may collect approximate location data based on your IP address. You can opt out of allowing us to collect more precise location information by disabling Location settings on your device.',
          ]},
        ],
      },
      {
        title: '2. HOW DO WE PROCESS YOUR INFORMATION?',
        blocks: [
          { type: 'em', text: 'In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.' },
          { type: 'p', text: 'We process your personal information for a variety of reasons, depending on how you interact with our Services, including:' },
          { type: 'ul', items: [
            'To facilitate account creation and authentication and otherwise manage user accounts.',
            'To deliver and facilitate delivery of services to the user.',
            'To evaluate and improve our Services, products, marketing, and your experience.',
            'To identify usage trends so we can improve our Services.',
            'To comply with our legal obligations, respond to legal requests, and exercise, establish, or defend our legal rights.',
          ]},
        ],
      },
      {
        title: '3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?',
        blocks: [
          { type: 'em', text: 'In Short: We may share information in specific situations described in this section.' },
          { type: 'p', text: 'We may need to share your personal information in the following situations:' },
          { type: 'p', text: 'Business Transfers. We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.' },
        ],
      },
      {
        title: '4. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?',
        blocks: [
          { type: 'em', text: 'In Short: We are not responsible for the safety of any information that you share with third parties that we may link to or who advertise on our Services, but are not affiliated with, our Services.' },
          { type: 'p', text: 'The Services may link to third-party websites, online services, or mobile applications and/or contain advertisements from third parties that are not affiliated with us. We do not make any guarantee regarding any such third parties, and we will not be liable for any loss or damage caused by the use of such third-party websites, services, or applications. Any data collected by third parties is not covered by this Privacy Notice. We are not responsible for the content, privacy, or security practices of any third parties. You should review the policies of such third parties and contact them directly to respond to your questions.' },
        ],
      },
      {
        title: '5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?',
        blocks: [
          { type: 'em', text: 'In Short: We may use cookies and other tracking technologies to collect and store your information.' },
          { type: 'p', text: 'We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Some online tracking technologies help us maintain the security of our Services, prevent crashes, fix bugs, save your preferences, and assist with basic site functions.' },
          { type: 'p', text: 'We also permit third parties and service providers to use online tracking technologies on our Services for analytics purposes. To the extent these online tracking technologies are deemed to be a "sale"/"sharing" under applicable US state laws, you can opt out by submitting a request as described in section 11 below.' },
        ],
      },
      {
        title: '6. HOW LONG DO WE KEEP YOUR INFORMATION?',
        blocks: [
          { type: 'em', text: 'In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.' },
          { type: 'p', text: 'We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.' },
          { type: 'p', text: 'When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible, then we will securely store your personal information and isolate it from any further processing until deletion is possible.' },
        ],
      },
      {
        title: '7. HOW DO WE KEEP YOUR INFORMATION SAFE?',
        blocks: [
          { type: 'em', text: 'In Short: We aim to protect your personal information through a system of organizational and technical security measures.' },
          { type: 'p', text: 'We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure. You should only access the Services within a secure environment.' },
        ],
      },
      {
        title: '8. DO WE COLLECT INFORMATION FROM MINORS?',
        blocks: [
          { type: 'em', text: 'In Short: We do not knowingly collect data from or market to children under 18 years of age.' },
          { type: 'p', text: 'We do not knowingly collect, solicit data from, or market to children under 18 years of age, nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 18 years of age. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at support@theleelumethod.com.' },
        ],
      },
      {
        title: '9. WHAT ARE YOUR PRIVACY RIGHTS?',
        blocks: [
          { type: 'em', text: 'In Short: You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.' },
          { type: 'p', text: 'Withdrawing your consent: If we are relying on your consent to process your personal information, you have the right to withdraw your consent at any time by contacting us using the contact details provided in section 13 below. Please note that this will not affect the lawfulness of the processing before its withdrawal.' },
          { type: 'p', text: 'Opting out of marketing and promotional communications: You can unsubscribe from our marketing and promotional communications at any time by clicking on the unsubscribe link in the emails that we send, replying "STOP" or "UNSUBSCRIBE" to the SMS messages that we send, or by contacting us. However, we may still communicate with you for non-marketing purposes related to your account.' },
          { type: 'h3', text: 'Account Information:' },
          { type: 'p', text: 'If you would like to review or change the information in your account or terminate your account, please contact us. Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms, or comply with applicable legal requirements.' },
          { type: 'p', text: 'If you have questions or comments about your privacy rights, you may email us at support@theleelumethod.com.' },
        ],
      },
      {
        title: '10. CONTROLS FOR DO-NOT-TRACK FEATURES',
        blocks: [
          { type: 'p', text: 'Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Notice.' },
          { type: 'p', text: 'California law requires us to let you know how we respond to web browser DNT signals. Because there currently is not an industry or legal standard for recognizing or honoring DNT signals, we do not respond to them at this time.' },
        ],
      },
      {
        title: '11. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?',
        blocks: [
          { type: 'em', text: 'In Short: If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Montana, New Hampshire, New Jersey, Oregon, Tennessee, Texas, Utah, or Virginia, you may have certain rights regarding your personal information.' },
          { type: 'h3', text: 'Categories of Personal Information We Collect' },
          { type: 'p', text: 'We have collected the following categories of personal information in the past twelve (12) months:' },
          { type: 'ul', items: [
            'A. Identifiers — Contact details such as name, telephone or mobile number, email address (YES)',
            'B. Personal information as defined in the California Customer Records statute — Name and contact information (YES)',
          ]},
          { type: 'p', text: 'We will use and retain collected personal information as needed to provide the Services, or for as long as the user has an account with us.' },
          { type: 'h3', text: 'Your Rights' },
          { type: 'p', text: 'You have rights under certain US state data protection laws. These rights include:' },
          { type: 'ul', items: [
            'Right to know whether or not we are processing your personal data',
            'Right to access your personal data',
            'Right to correct inaccuracies in your personal data',
            'Right to request the deletion of your personal data',
            'Right to obtain a copy of the personal data you previously shared with us',
            'Right to non-discrimination for exercising your rights',
            'Right to opt out of the processing of your personal data if it is used for targeted advertising, the sale of personal data, or profiling',
          ]},
          { type: 'h3', text: 'How to Exercise Your Rights' },
          { type: 'p', text: 'To exercise these rights, you can contact us by email at support@theleelumethod.com or by referring to the contact details at the bottom of this document.' },
          { type: 'p', text: 'We will honor your opt-out preferences if you enact the Global Privacy Control (GPC) opt-out signal on your browser.' },
          { type: 'h3', text: 'Appeals' },
          { type: 'p', text: 'Under certain US state data protection laws, if we decline to take action regarding your request, you may appeal our decision by emailing us at support@theleelumethod.com. We will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions. If your appeal is denied, you may submit a complaint to your state attorney general.' },
          { type: 'h3', text: 'California "Shine The Light" Law' },
          { type: 'p', text: 'California Civil Code Section 1798.83, also known as the "Shine The Light" law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact details at the bottom of this page.' },
        ],
      },
      {
        title: '12. DO WE MAKE UPDATES TO THIS NOTICE?',
        blocks: [
          { type: 'em', text: 'In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws.' },
          { type: 'p', text: 'We may update this Privacy Notice from time to time. The updated version will be indicated by an updated "Revised" date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.' },
        ],
      },
      {
        title: '13. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?',
        blocks: [
          { type: 'p', text: 'If you have questions or comments about this notice, you may contact us by email at support@theleelumethod.com' },
        ],
      },
      {
        title: '14. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?',
        blocks: [
          { type: 'p', text: 'You have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. To request to review, update, or delete your personal information, please contact us at support@theleelumethod.com.' },
        ],
      },
    ],
  },
  {
    heading: 'Cookie Policy',
    date: 'Last updated May 30, 2026',
    intro: [
      { type: 'p', text: 'This Cookie Policy explains how The Leelu Method ("Company," "we," "us," and "our") uses cookies and similar technologies to recognize you when you visit our website ("Website"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.' },
    ],
    sections: [
      {
        title: 'What are cookies?',
        blocks: [
          { type: 'p', text: 'Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.' },
          { type: 'p', text: 'Cookies set by the website owner (in this case, The Leelu Method) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies." Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., interactive content and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.' },
        ],
      },
      {
        title: 'Why do we use cookies?',
        blocks: [
          { type: 'p', text: 'We use first- and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate — we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to understand how our Website is being used so we can improve it. We do not use cookies to serve targeted advertising.' },
        ],
      },
      {
        title: 'How can I control cookies?',
        blocks: [
          { type: 'p', text: 'You have the right to decide whether to accept or reject cookies. If you choose to reject cookies, you may still use our Website though your access to some functionality and areas of our Website may be restricted.' },
          { type: 'p', text: 'You may set or amend your web browser controls to accept or refuse cookies at any time. The following is information about how to manage cookies on the most popular browsers:' },
          { type: 'ul', items: ['Chrome', 'Internet Explorer', 'Firefox', 'Safari', 'Edge', 'Opera'] },
        ],
      },
      {
        title: 'What about other tracking technologies, like web beacons?',
        blocks: [
          { type: 'p', text: 'Cookies are not the only way to recognize or track visitors to a website. We may use other similar technologies from time to time, like web beacons (sometimes called "tracking pixels" or "clear gifs"). These are tiny graphics files that contain a unique identifier that enables us to recognize when someone has visited our Website or opened an email. In many instances, these technologies are reliant on cookies to function properly, and so declining cookies will impair their functioning.' },
        ],
      },
      {
        title: 'How often will you update this Cookie Policy?',
        blocks: [
          { type: 'p', text: 'We may update this Cookie Policy from time to time to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed. The date at the top of this Cookie Policy indicates when it was last updated.' },
        ],
      },
      {
        title: 'Where can I get further information?',
        blocks: [
          { type: 'p', text: 'If you have any questions about our use of cookies or other technologies, please email us at support@theleelumethod.com.' },
        ],
      },
    ],
  },
  {
    heading: 'Terms of Service',
    date: 'Last updated May 30, 2026',
    intro: [
      { type: 'h3', text: 'AGREEMENT TO OUR LEGAL TERMS' },
      { type: 'p', text: 'We are The Leelu Method ("Company," "we," "us," "our"), operating the website and related products and services that refer or link to these legal terms (the "Services").' },
      { type: 'p', text: 'You can contact us by email at support@theleelumethod.com.' },
      { type: 'p', text: 'These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and The Leelu Method, concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.' },
      { type: 'p', text: 'We reserve the right, in our sole discretion, to make changes or modifications to these Legal Terms at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of these Legal Terms, and you waive any right to receive specific notice of each such change. It is your responsibility to periodically review these Legal Terms to stay informed of updates. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Legal Terms by your continued use of the Services after the date such revised Legal Terms are posted.' },
      { type: 'p', text: 'The Services are intended for users who are at least 18 years old. Persons under the age of 18 are not permitted to use or register for the Services.' },
    ],
    sections: [
      {
        title: 'TABLE OF CONTENTS',
        blocks: [
          { type: 'ul', items: [
            '1. OUR SERVICES',
            '2. INTELLECTUAL PROPERTY RIGHTS',
            '3. USER REPRESENTATIONS',
            '4. USER REGISTRATION',
            '5. PURCHASES AND PAYMENT',
            '6. SUBSCRIPTIONS',
            '7. REFUND POLICY',
            '8. PROHIBITED ACTIVITIES',
            '9. USER GENERATED CONTRIBUTIONS',
            '10. CONTRIBUTION LICENSE',
            '11. THIRD-PARTY WEBSITES AND CONTENT',
            '12. SERVICES MANAGEMENT',
            '13. PRIVACY POLICY',
            '14. DIGITAL MILLENNIUM COPYRIGHT ACT (DMCA) NOTICE AND POLICY',
            '15. TERM AND TERMINATION',
            '16. MODIFICATIONS AND INTERRUPTIONS',
            '17. GOVERNING LAW',
            '18. DISPUTE RESOLUTION',
            '19. CORRECTIONS',
            '20. DISCLAIMER',
            '21. LIMITATIONS OF LIABILITY',
            '22. INDEMNIFICATION',
            '23. USER DATA',
            '24. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES',
            '25. SMS TEXT MESSAGING',
            '26. CALIFORNIA USERS AND RESIDENTS',
            '27. MISCELLANEOUS',
            '28. CONTACT US',
          ]},
        ],
      },
      {
        title: '1. OUR SERVICES',
        blocks: [
          { type: 'p', text: 'The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.' },
        ],
      },
      {
        title: '2. INTELLECTUAL PROPERTY RIGHTS',
        blocks: [
          { type: 'h3', text: 'Our intellectual property' },
          { type: 'p', text: 'We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the "Content"), as well as the trademarks, service marks, and logos contained therein (the "Marks").' },
          { type: 'p', text: 'Our Content and Marks are protected by copyright and trademark laws and treaties in the United States and around the world.' },
          { type: 'p', text: 'The Content and Marks are provided in or through the Services "AS IS" for your personal, non-commercial use or internal business purpose only.' },
          { type: 'h3', text: 'Your use of our Services' },
          { type: 'p', text: 'Subject to your compliance with these Legal Terms, we grant you a non-exclusive, non-transferable, revocable license to access the Services and download or print a copy of any portion of the Content to which you have properly gained access, solely for your personal, non-commercial use or internal business purpose.' },
          { type: 'p', text: 'Except as set out in this section, no part of the Services and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.' },
          { type: 'p', text: 'Any breach of these Intellectual Property Rights will constitute a material breach of our Legal Terms and your right to use our Services will terminate immediately.' },
          { type: 'h3', text: 'Your submissions and contributions' },
          { type: 'p', text: 'By directly sending us any question, comment, suggestion, idea, feedback, or other information about the Services ("Submissions"), you agree to assign to us all intellectual property rights in such Submission. You agree that we shall own this Submission and be entitled to its unrestricted use and dissemination for any lawful purpose, commercial or otherwise, without acknowledgment or compensation to you.' },
          { type: 'p', text: 'You are solely responsible for your Submissions and/or Contributions and you expressly agree to reimburse us for any and all losses that we may suffer because of your breach of these terms, any third party\'s intellectual property rights, or applicable law.' },
        ],
      },
      {
        title: '3. USER REPRESENTATIONS',
        blocks: [
          { type: 'p', text: 'By using the Services, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Legal Terms; (4) you are not a minor in the jurisdiction in which you reside; (5) you will not access the Services through automated or non-human means, whether through a bot, script or otherwise; (6) you will not use the Services for any illegal or unauthorized purpose; and (7) your use of the Services will not violate any applicable law or regulation.' },
        ],
      },
      {
        title: '4. USER REGISTRATION',
        blocks: [
          { type: 'p', text: 'You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.' },
        ],
      },
      {
        title: '5. PURCHASES AND PAYMENT',
        blocks: [
          { type: 'p', text: 'We accept the following forms of payment:' },
          { type: 'ul', items: ['Visa', 'Mastercard', 'American Express', 'Discover', 'PayPal'] },
          { type: 'p', text: 'You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Services. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed. Sales tax will be added to the price of purchases as deemed required by us. We may change prices at any time. All payments shall be in US dollars.' },
          { type: 'p', text: 'We reserve the right to refuse any order placed through the Services. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order.' },
        ],
      },
      {
        title: '6. SUBSCRIPTIONS',
        blocks: [
          { type: 'h3', text: 'Billing and Renewal' },
          { type: 'p', text: 'Your subscription will continue and automatically renew unless canceled. You consent to our charging your payment method on a recurring basis without requiring your prior approval for each recurring charge, until such time as you cancel the applicable order. The length of your billing cycle is monthly.' },
          { type: 'h3', text: 'Cancellation' },
          { type: 'p', text: 'You can cancel your subscription at any time by logging into your account. Your cancellation will take effect at the end of the current paid term. If you have any questions or are unsatisfied with our Services, please email us at support@theleelumethod.com.' },
          { type: 'h3', text: 'Fee Changes' },
          { type: 'p', text: 'We may, from time to time, make changes to the subscription fee and will communicate any price changes to you in accordance with applicable law.' },
        ],
      },
      {
        title: '7. REFUND POLICY',
        blocks: [
          { type: 'p', text: 'All sales are final and no refund will be issued.' },
        ],
      },
      {
        title: '8. PROHIBITED ACTIVITIES',
        blocks: [
          { type: 'p', text: 'You may not access or use the Services for any purpose other than that for which we make the Services available. As a user of the Services, you agree not to:' },
          { type: 'ul', items: [
            'Systematically retrieve data or other content from the Services to create or compile a collection, compilation, database, or directory without written permission from us.',
            'Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.',
            'Circumvent, disable, or otherwise interfere with security-related features of the Services.',
            'Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.',
            'Use any information obtained from the Services in order to harass, abuse, or harm another person.',
            'Make improper use of our support services or submit false reports of abuse or misconduct.',
            'Use the Services in a manner inconsistent with any applicable laws or regulations.',
            'Upload or transmit viruses, Trojan horses, or other malicious material that interferes with any party\'s uninterrupted use and enjoyment of the Services.',
            'Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.',
            'Attempt to impersonate another user or person or use the username of another user.',
            'Interfere with, disrupt, or create an undue burden on the Services or the networks or services connected to the Services.',
            'Attempt to bypass any measures of the Services designed to prevent or restrict access to the Services, or any portion of the Services.',
            'Use the Services as part of any effort to compete with us or otherwise use the Services and/or the Content for any revenue-generating endeavor or commercial enterprise.',
            'Sell or otherwise transfer your profile.',
          ]},
        ],
      },
      {
        title: '9. USER GENERATED CONTRIBUTIONS',
        blocks: [
          { type: 'p', text: 'The Services may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality, and may provide you with the opportunity to create, submit, post, display, transmit, or broadcast content and materials to us or on the Services, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information (collectively, "Contributions"). Contributions may be viewable by other users of the Services. As such, any Contributions you transmit may be treated as non-confidential and non-proprietary.' },
          { type: 'p', text: 'When you create or make available any Contributions, you represent and warrant that your Contributions are accurate, not misleading, do not violate any applicable law or regulation, do not infringe the intellectual property rights of any third party, and are not obscene, harassing, hateful, or otherwise objectionable.' },
        ],
      },
      {
        title: '10. CONTRIBUTION LICENSE',
        blocks: [
          { type: 'p', text: 'By posting your Contributions to any part of the Services, you automatically grant to us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right and license to host, use, copy, reproduce, disclose, sell, resell, publish, broadcast, retitle, archive, store, publicly perform, publicly display, reformat, translate, transmit, excerpt, and distribute such Contributions for any purpose, commercial or otherwise, and to prepare derivative works of, or incorporate into other works, such Contributions.' },
          { type: 'p', text: 'We do not assert any ownership over your Contributions. You retain full ownership of all of your Contributions and any intellectual property rights associated with your Contributions. We are not liable for any statements or representations in your Contributions. You are solely responsible for your Contributions and you expressly agree to exonerate us from any and all responsibility regarding your Contributions.' },
        ],
      },
      {
        title: '11. THIRD-PARTY WEBSITES AND CONTENT',
        blocks: [
          { type: 'p', text: 'The Services may contain links to other websites ("Third-Party Websites") as well as content belonging to or originating from third parties ("Third-Party Content"). Such Third-Party Websites and Third-Party Content are not investigated, monitored, or checked for accuracy or completeness by us, and we are not responsible for any Third-Party Websites accessed through the Services or any Third-Party Content posted on, available through, or installed from the Services.' },
          { type: 'p', text: 'Inclusion of, linking to, or permitting the use of any Third-Party Websites or Third-Party Content does not imply approval or endorsement by us. If you decide to leave the Services and access Third-Party Websites, you do so at your own risk. Any purchases you make through Third-Party Websites are exclusively between you and the respective third party, and we take no responsibility for such purchases.' },
        ],
      },
      {
        title: '12. SERVICES MANAGEMENT',
        blocks: [
          { type: 'p', text: 'We reserve the right, but not the obligation, to: (1) monitor the Services for violations of these Legal Terms; (2) take appropriate legal action against anyone who, in our sole discretion, violates the law or these Legal Terms; (3) in our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or disable any of your Contributions or any portion thereof; and (4) otherwise manage the Services in a manner designed to protect our rights and property and to facilitate the proper functioning of the Services.' },
        ],
      },
      {
        title: '13. PRIVACY POLICY',
        blocks: [
          { type: 'p', text: 'We care about data privacy and security. Please review our Privacy Policy on this page. By using the Services, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms. Please be advised the Services are hosted in the United States. If you access the Services from any other region of the world, through your continued use of the Services, you are transferring your data to the United States, and you expressly consent to have your data transferred to and processed in the United States.' },
        ],
      },
      {
        title: '14. DIGITAL MILLENNIUM COPYRIGHT ACT (DMCA) NOTICE AND POLICY',
        blocks: [
          { type: 'h3', text: 'Notifications' },
          { type: 'p', text: 'We respect the intellectual property rights of others. If you believe that any material available on or through the Services infringes upon any copyright you own or control, please notify us using the contact information provided below. All notifications should meet the requirements of DMCA 17 U.S.C. § 512(c)(3) and include the following information:' },
          { type: 'ul', items: [
            'A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed;',
            'Identification of the copyrighted work claimed to have been infringed;',
            'Identification of the material that is claimed to be infringing and information reasonably sufficient to permit us to locate the material;',
            'Information reasonably sufficient to permit us to contact the complaining party, such as an address, telephone number, and email address;',
            'A statement that the complaining party has a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law;',
            'A statement that the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the owner of the exclusive right that is allegedly infringed.',
          ]},
          { type: 'h3', text: 'Counter Notification' },
          { type: 'p', text: 'If you believe your own copyrighted material has been removed from the Services as a result of a mistake or misidentification, you may submit a written counter notification to us using the contact information provided below. To be effective, your Counter Notification must include: (1) identification of the material that has been removed and the location at which it appeared; (2) a statement that you consent to the jurisdiction of the Federal District Court for the judicial district in which your address is located; (3) a statement that you will accept service of process from the party that filed the notification; (4) your name, address, and telephone number; (5) a statement under penalty of perjury that you have a good faith belief that the material was removed by mistake or misidentification; and (6) your physical or electronic signature.' },
        ],
      },
      {
        title: '15. TERM AND TERMINATION',
        blocks: [
          { type: 'p', text: 'These Legal Terms shall remain in full force and effect while you use the Services. WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES TO ANY PERSON FOR ANY REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION IN THE SERVICES OR DELETE YOUR ACCOUNT AND ANY CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT WARNING, IN OUR SOLE DISCRETION.' },
          { type: 'p', text: 'If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party. In addition to terminating or suspending your account, we reserve the right to take appropriate legal action, including without limitation pursuing civil, criminal, and injunctive redress.' },
        ],
      },
      {
        title: '16. MODIFICATIONS AND INTERRUPTIONS',
        blocks: [
          { type: 'p', text: 'We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. We also reserve the right to modify or discontinue all or part of the Services without notice at any time. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Services.' },
          { type: 'p', text: 'We cannot guarantee the Services will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the Services, resulting in interruptions, delays, or errors. Nothing in these Legal Terms will be construed to obligate us to maintain and support the Services or to supply any corrections, updates, or releases in connection therewith.' },
        ],
      },
      {
        title: '17. GOVERNING LAW',
        blocks: [
          { type: 'p', text: 'These Legal Terms and your use of the Services are governed by and construed in accordance with the laws of the State of Connecticut applicable to agreements made and to be entirely performed within the State of Connecticut, without regard to its conflict of law principles.' },
        ],
      },
      {
        title: '18. DISPUTE RESOLUTION',
        blocks: [
          { type: 'h3', text: 'Binding Arbitration' },
          { type: 'p', text: 'If the Parties are unable to resolve a dispute through informal negotiations, the dispute (except those expressly excluded below) will be finally and exclusively resolved by binding arbitration. YOU UNDERSTAND THAT WITHOUT THIS PROVISION, YOU WOULD HAVE THE RIGHT TO SUE IN COURT AND HAVE A JURY TRIAL. The arbitration shall be commenced and conducted under the Commercial Arbitration Rules of the American Arbitration Association ("AAA"). The arbitration will take place in the State of Connecticut. The arbitrator must follow applicable law, and any award may be challenged if the arbitrator fails to do so.' },
          { type: 'p', text: 'If for any reason a dispute proceeds in court rather than arbitration, the dispute shall be commenced or prosecuted in the state and federal courts located in Connecticut, and the Parties hereby consent to and waive all defenses of lack of personal jurisdiction and forum non conveniens with respect to venue and jurisdiction in such courts.' },
          { type: 'p', text: 'In no event shall any dispute brought by either Party related in any way to the Services be commenced more than one (1) year after the cause of action arose.' },
          { type: 'h3', text: 'Restrictions' },
          { type: 'p', text: 'The Parties agree that any arbitration shall be limited to the dispute between the Parties individually. To the full extent permitted by law: (a) no arbitration shall be joined with any other proceeding; (b) there is no right or authority for any dispute to be arbitrated on a class-action basis; and (c) there is no right or authority for any dispute to be brought in a purported representative capacity on behalf of the general public or any other persons.' },
          { type: 'h3', text: 'Exceptions to Arbitration' },
          { type: 'p', text: 'The following disputes are not subject to binding arbitration: (a) any disputes seeking to enforce or protect, or concerning the validity of, any intellectual property rights of a Party; (b) any dispute related to allegations of theft, piracy, invasion of privacy, or unauthorized use; and (c) any claim for injunctive relief.' },
        ],
      },
      {
        title: '19. CORRECTIONS',
        blocks: [
          { type: 'p', text: 'There may be information on the Services that contains typographical errors, inaccuracies, or omissions, including descriptions, pricing, availability, and various other information. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information on the Services at any time, without prior notice.' },
        ],
      },
      {
        title: '20. DISCLAIMER',
        blocks: [
          { type: 'p', text: 'THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICES\' CONTENT AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS, PERSONAL INJURY OR PROPERTY DAMAGE RESULTING FROM YOUR ACCESS TO AND USE OF THE SERVICES, ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS, ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SERVICES, OR ANY BUGS, VIRUSES, OR OTHER HARMFUL CODE WHICH MAY BE TRANSMITTED TO OR THROUGH THE SERVICES BY ANY THIRD PARTY.' },
        ],
      },
      {
        title: '21. LIMITATIONS OF LIABILITY',
        blocks: [
          { type: 'p', text: 'IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER WILL AT ALL TIMES BE LIMITED TO THE AMOUNT PAID, IF ANY, BY YOU TO US DURING THE SIX (6) MONTH PERIOD PRIOR TO ANY CAUSE OF ACTION ARISING.' },
        ],
      },
      {
        title: '22. INDEMNIFICATION',
        blocks: [
          { type: 'p', text: 'You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys\' fees and expenses, made by any third party due to or arising out of: (1) your Contributions; (2) use of the Services; (3) breach of these Legal Terms; (4) any breach of your representations and warranties set forth in these Legal Terms; or (5) your violation of the rights of a third party, including but not limited to intellectual property rights.' },
        ],
      },
      {
        title: '23. USER DATA',
        blocks: [
          { type: 'p', text: 'We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your use of the Services. You are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Services. You agree that we shall have no liability to you for any loss or corruption of any such data, and you hereby waive any right of action against us arising from any such loss or corruption of such data.' },
        ],
      },
      {
        title: '24. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES',
        blocks: [
          { type: 'p', text: 'Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically satisfy any legal requirement that such communication be in writing. YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SERVICES.' },
        ],
      },
      {
        title: '25. SMS TEXT MESSAGING',
        blocks: [
          { type: 'h3', text: 'Opting Out' },
          { type: 'p', text: 'If at any time you wish to stop receiving SMS messages from us, simply reply to the text with "STOP." You may receive an SMS message confirming your opt out.' },
          { type: 'h3', text: 'Message and Data Rates' },
          { type: 'p', text: 'Please be aware that message and data rates may apply to any SMS messages sent or received. The rates are determined by your carrier and the specifics of your mobile plan.' },
          { type: 'h3', text: 'Support' },
          { type: 'p', text: 'If you have any questions or need assistance regarding our SMS communications, please email us at support@theleelumethod.com.' },
        ],
      },
      {
        title: '26. CALIFORNIA USERS AND RESIDENTS',
        blocks: [
          { type: 'p', text: 'If any complaint with us is not satisfactorily resolved, you can contact the Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs in writing at 1625 North Market Blvd., Suite N 112, Sacramento, California 95834 or by telephone at (800) 952-5210 or (916) 445-1254.' },
        ],
      },
      {
        title: '27. MISCELLANEOUS',
        blocks: [
          { type: 'p', text: 'These Legal Terms and any policies or operating rules posted by us on the Services constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Legal Terms shall not operate as a waiver of such right or provision. These Legal Terms operate to the fullest extent permissible by law. We may assign any or all of our rights and obligations to others at any time. If any provision or part of a provision of these Legal Terms is determined to be unlawful, void, or unenforceable, that provision is deemed severable from these Legal Terms and does not affect the validity and enforceability of any remaining provisions. There is no joint venture, partnership, employment, or agency relationship created between you and us as a result of these Legal Terms or use of the Services.' },
        ],
      },
      {
        title: '28. CONTACT US',
        blocks: [
          { type: 'p', text: 'In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:' },
          { type: 'p', text: 'The Leelu Method' },
          { type: 'p', text: 'support@theleelumethod.com' },
        ],
      },
    ],
  },
  {
    heading: 'Refund Policy',
    sections: [
      {
        title: 'REFUNDS',
        blocks: [
          { type: 'p', text: 'All sales are final and no refund will be issued.' },
        ],
      },
    ],
  },
  {
    heading: 'Disclaimer',
    date: 'Last updated May 30, 2025',
    sections: [
      {
        title: 'WEBSITE DISCLAIMER',
        blocks: [
          { type: 'p', text: 'The information provided by The Leelu Method ("we," "us," or "our") on https://love.theleelumethod.com (the "Site") is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.' },
          { type: 'p', text: 'UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE. YOUR USE OF THE SITE AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE IS SOLELY AT YOUR OWN RISK.' },
        ],
      },
      {
        title: 'EXTERNAL LINKS DISCLAIMER',
        blocks: [
          { type: 'p', text: 'The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.' },
          { type: 'p', text: 'WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THE ACCURACY OR RELIABILITY OF ANY INFORMATION OFFERED BY THIRD-PARTY WEBSITES LINKED THROUGH THE SITE. WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES.' },
        ],
      },
      {
        title: 'PROFESSIONAL DISCLAIMER',
        blocks: [
          { type: 'p', text: 'The Site does not contain medical or health advice. Any information on the Site is provided for general informational and educational purposes only and is not a substitute for professional advice. Before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. The Leelu Method provides relationship coaching and educational content only and does not provide any kind of medical or health advice.' },
          { type: 'p', text: 'THE USE OR RELIANCE OF ANY INFORMATION CONTAINED ON THE SITE IS SOLELY AT YOUR OWN RISK.' },
        ],
      },
    ],
  },
  {
    heading: 'Acceptable Use Policy',
    date: 'Last updated May 30, 2026',
    intro: [
      { type: 'p', text: 'This Acceptable Use Policy ("Policy") is part of our Terms of Service ("Legal Terms") and should be read alongside our main Legal Terms at https://love.theleelumethod.com. If you do not agree with these Legal Terms, please stop using our Services. Your continued use of our Services implies acceptance of these Legal Terms.' },
      { type: 'p', text: 'Please carefully review this Policy which applies to any and all:' },
      { type: 'ul', items: [
        '(a) uses of our Services (as defined in our Legal Terms)',
        '(b) forms, materials, consent tools, comments, posts, and all other content available on the Services ("Content")',
        '(c) material which you contribute to the Services including any upload, post, review, disclosure, ratings, comments, chat, etc. in any forum, chatrooms, reviews, and to any interactive services associated with it ("Contribution")',
      ]},
    ],
    sections: [
      {
        title: 'WHO WE ARE',
        blocks: [
          { type: 'p', text: 'We are The Leelu Method ("Company," "we," "us," or "our"), operating the website at https://love.theleelumethod.com (the "Site") as well as any other related products and services that refer or link to this Policy (collectively, the "Services").' },
        ],
      },
      {
        title: 'USE OF THE SERVICES',
        blocks: [
          { type: 'p', text: 'When you use the Services you warrant that you will comply with this Policy and with all applicable laws.' },
          { type: 'p', text: 'You also acknowledge that you may not:' },
          { type: 'ul', items: [
            'Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.',
            'Make any unauthorized use of the Services, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretenses.',
            'Circumvent, disable, or otherwise interfere with security-related features of the Services, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Services.',
            'Engage in unauthorized framing of or linking to the Services.',
            'Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.',
            'Make improper use of our Services, including our support services, or submit false reports of abuse or misconduct.',
            'Engage in any automated use of the Services, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.',
            'Interfere with, disrupt, or create an undue burden on the Services or the networks connected to the Services.',
            'Attempt to impersonate another user or person or use the username of another user.',
            'Use any information obtained from the Services in order to harass, abuse, or harm another person.',
            'Use the Services as part of any effort to compete with us or otherwise use the Services and/or the Content for any revenue-generating endeavor or commercial enterprise.',
            'Decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Services, except as expressly permitted by applicable law.',
            'Attempt to bypass any measures of the Services designed to prevent or restrict access to the Services, or any portion of the Services.',
            'Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Services to you.',
            'Delete the copyright or other proprietary rights notice from any Content.',
            "Upload or transmit viruses, Trojan horses, or other malicious material that interferes with any party's uninterrupted use and enjoyment of the Services.",
            'Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.',
            'Use the Services in a manner inconsistent with any applicable laws or regulations.',
            'Sell or otherwise transfer your profile.',
          ]},
          { type: 'p', text: 'If you subscribe to our Services, you understand, acknowledge, and agree that you may not, except if expressly permitted:' },
          { type: 'ul', items: [
            'Engage in any use, including modification, copying, redistribution, publication, display, performance, or retransmission of any portion of the Services, without the prior written consent of The Leelu Method.',
            'Reconstruct or attempt to discover any source code or algorithms of the Services, or any portion thereof, by any means whatsoever.',
            'Provide, or otherwise make available, the Services to any third party.',
            'Intercept any data not intended for you.',
            "Damage, reveal, or alter any user's data, or any other hardware, software, or information relating to another person or entity.",
          ]},
        ],
      },
      {
        title: 'CONTRIBUTIONS',
        blocks: [
          { type: 'p', text: 'In this Policy, the term "Contributions" means any data, information, software, text, code, music, scripts, sound, graphics, photos, videos, tags, messages, interactive features, or other materials that you post, share, upload, submit, or otherwise provide in any manner on or through the Services, or any other content or materials you provide to The Leelu Method or use with the Services.' },
          { type: 'p', text: 'Some areas of the Services may allow users to upload, transmit, or post Contributions. We may but are under no obligation to review or moderate Contributions made on the Services, and we expressly exclude our liability for any loss or damage resulting from any of our users\' breach of this Policy.' },
          { type: 'p', text: 'You warrant that:' },
          { type: 'ul', items: [
            'You are the creator and owner of or have the necessary licenses, rights, consents, releases, and permissions to use and to authorize us, the Services, and other users of the Services to use your Contributions in any manner contemplated by the Services and this Policy.',
            'All your Contributions comply with applicable laws and are original and true (if they represent your opinion or facts).',
            'The creation, distribution, transmission, public display, or performance, and the accessing, downloading, or copying of your Contributions do not and will not infringe the proprietary rights, including but not limited to the copyright, patent, trademark, trade secret, or moral rights of any third party.',
            'You have the verifiable consent, releases, and/or permission of each and every identifiable individual person in your Contributions to use the name or likeness of each and every such identifiable individual person to enable inclusion and use of your Contributions in any manner contemplated by the Services and this Policy.',
          ]},
          { type: 'p', text: 'You also agree that you will not post, transmit, or upload any Contribution that:' },
          { type: 'ul', items: [
            'Is in breach of applicable laws, regulation, court order, contractual obligation, this Policy, our Legal Terms, or a legal duty, or that promotes or facilitates fraud or illegal activities.',
            'Is defamatory, obscene, offensive, hateful, insulting, intimidating, bullying, abusive, or threatening to any person or group.',
            'Is false, inaccurate, or misleading.',
            'Includes child sexual abuse material, or violates any applicable law concerning child pornography or otherwise intended to protect minors.',
            'Contains any material that solicits personal information from anyone under the age of 18 or exploits people under the age of 18 in a sexual or violent manner.',
            'Promotes violence, advocates the violent overthrow of any government, or incites, encourages, or threatens physical harm against another.',
            'Is discriminatory based on race, sex, religion, nationality, disability, sexual orientation, or age.',
            'Promotes, facilitates, or assists anyone in promoting and facilitating acts of terrorism.',
            "Infringes, or assists anyone in infringing, a third party's intellectual property rights or publicity or privacy rights.",
            'Is deceitful, misrepresents your identity or affiliation with any person, or misleads anyone as to your relationship with us.',
            'Contains unsolicited or unauthorized advertising, promotional materials, pyramid schemes, chain letters, spam, mass mailings, or other forms of solicitation.',
          ]},
        ],
      },
      {
        title: 'REVIEW AND RATINGS',
        blocks: [
          { type: 'p', text: 'When your Contribution is a review or rating, you also agree that:' },
          { type: 'ul', items: [
            'You have firsthand experience with the services being reviewed.',
            'Your Contribution is true to your experience.',
            'You are not affiliated with competitors if posting negative reviews.',
            'You cannot make or offer any conclusions as to the legality of conduct.',
            'You cannot post any false or misleading statements.',
            'You do not and will not organize a campaign encouraging others to post reviews, whether positive or negative.',
          ]},
        ],
      },
      {
        title: 'REPORTING A BREACH OF THIS POLICY',
        blocks: [
          { type: 'p', text: 'We may but are under no obligation to review or moderate the Contributions made on the Services, and we expressly exclude our liability for any loss or damage resulting from any of our users\' breach of this Policy.' },
          { type: 'p', text: 'If you consider that any Content or Contribution breaches this Policy or infringes any third-party intellectual property rights, please contact us at support@theleelumethod.com and let us know which Content or Contribution is in breach of this Policy and why. We will reasonably determine whether a Content or Contribution breaches this Policy.' },
        ],
      },
      {
        title: 'CONSEQUENCES OF BREACHING THIS POLICY',
        blocks: [
          { type: 'p', text: 'The consequences for violating our Policy will vary depending on the severity of the breach and the user\'s history on the Services. We may, in some cases, give you a warning and/or remove the infringing Contribution. However, if your breach is serious or if you continue to breach our Legal Terms and this Policy, we have the right to suspend or terminate your access to and use of our Services and, if applicable, disable your account. We may also notify law enforcement or issue legal proceedings against you when we believe that there is a genuine risk to an individual or a threat to public safety.' },
          { type: 'p', text: 'We exclude our liability for all action we may take in response to any of your breaches of this Policy.' },
        ],
      },
      {
        title: 'DISCLAIMER',
        blocks: [
          { type: 'p', text: 'The Leelu Method is under no obligation to monitor users\' activities, and we disclaim any responsibility for any user\'s misuse of the Services. The Leelu Method has no responsibility for any user or other Content or Contribution created, maintained, stored, transmitted, or accessible on or through the Services, and is not obligated to monitor or exercise any editorial control over such material. If The Leelu Method becomes aware that any such Content or Contribution violates this Policy, The Leelu Method may, in addition to removing such Content or Contribution and blocking your account, report such breach to the appropriate regulatory authority.' },
        ],
      },
      {
        title: 'HOW CAN YOU CONTACT US ABOUT THIS POLICY?',
        blocks: [
          { type: 'p', text: 'If you have any further questions or comments or wish to report any problematic Content or Contribution, please contact us at:' },
          { type: 'p', text: 'The Leelu Method 600 Fifth Avenue, 2nd Floor, New York, NY 10020 United States support@theleelumethod.com' },
        ],
      },
    ],
  },
];

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case 'h3':
      return (
        <h3 key={i} className='font-lato font-semibold text-[16px] text-brand-deep mt-6 mb-1'>
          {block.text}
        </h3>
      );
    case 'em':
      return (
        <p key={i} className='font-lato italic text-[15px]/[26px] text-brand-gray mt-2'>
          {block.text}
        </p>
      );
    case 'p':
      return (
        <p key={i} className='font-lato text-[16px]/[28px] text-brand-gray mt-3'>
          {block.text}
        </p>
      );
    case 'ul':
      return (
        <ul key={i} className='list-disc pl-6 font-lato text-[16px]/[28px] text-brand-gray mt-3 space-y-1'>
          {block.items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      );
  }
}

function SectionBlock({ section }: { section: Section }) {
  return (
    <div>
      <h2 className='font-canela font-thin text-brand-deep text-[28px] lg:text-[36px] leading-[130%] mb-2'>
        {section.title}
      </h2>
      {section.blocks.map((block, i) => renderBlock(block, i))}
    </div>
  );
}

export default function LegalPage() {
  return (
    <main className='bg-brand-white min-h-screen'>
      <Header />
      <div className='container px-4 sm:px-6 lg:px-[40px] pt-[120px] pb-[80px] max-w-[800px]'>
        {documents.map((doc, i) => (
          <div
            key={doc.heading}
            id={doc.heading.toLowerCase().replace(/\s+/g, '-')}
            className={i > 0 ? 'mt-24 scroll-mt-24' : 'scroll-mt-24'}
          >
            {doc.date && (
              <p className='font-lato text-[12px] tracking-widest uppercase text-brand-gray mb-4'>
                {doc.date}
              </p>
            )}
            <h1 className='font-canela font-thin text-brand-deep text-[56px] lg:text-[72px] leading-[110%] mb-8'>
              {doc.heading}
            </h1>
            {doc.intro && (
              <div className='mb-16'>
                {doc.intro.map((block, j) => renderBlock(block, j))}
              </div>
            )}
            <div className='flex flex-col gap-12'>
              {doc.sections.map((section) => (
                <SectionBlock key={section.title} section={section} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
