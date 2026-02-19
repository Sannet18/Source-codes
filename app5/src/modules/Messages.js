import  Message  from '../models/Message.js'

const user1 = {
  username: 'Johnny',
  firstName: 'John',
  lastName: 'Doe',
}

const user2 = {
  username: 'Jane',
  firstName: 'Jane',
  lastName: 'Smith',
}

const messages = [
  new Message({
    id: 1,
    ...user1,
    message:
      'Hey! Good morning. Did you get a chance to look at the project proposal I sent you last night?',
  }),
  new Message({
    id: 2,
    ...user2,
    message:
      'Good morning! Yes, I did. I went through it briefly before bed, but I think we should discuss some of the timeline details because a few milestones seem a bit too optimistic.',
  }),
  new Message({
    id: 3,
    ...user1,
    message:
      'That makes sense. I was trying to keep it ambitious but still achievable. Which specific milestones do you think need more buffer time?',
  }),
  new Message({
    id: 4,
    ...user2,
    message:
      'The development phase, especially the integration with the third-party API, might take longer than we expect. We should account for testing, debugging, and possible delays from the external provider.',
  }),
  new Message({
    id: 5,
    ...user1,
    message:
      "You're right. I remember last time we underestimated the time required for proper testing and documentation, and it caused unnecessary stress during the final week before release.",
  }),
  new Message({
    id: 6,
    ...user2,
    message:
      'Exactly. If we plan more realistically this time, we can avoid working late nights and scrambling to fix last-minute bugs that could have been caught earlier with better planning.',
  }),
  new Message({
    id: 7,
    ...user1,
    message:
      "Okay, let's extend the integration phase by one additional week and add a dedicated testing sprint before deployment. That should give us breathing room.",
  }),
  new Message({
    id: 8,
    ...user2,
    message:
      'I agree with that adjustment. Also, we should clearly define responsibilities so there is no confusion about who owns which deliverable during each phase of the project.',
  }),
  new Message({
    id: 9,
    ...user1,
    message:
      'Good point. I can handle backend development and API integration, and you can lead the frontend implementation and user experience improvements.',
  }),
  new Message({
    id: 10,
    ...user2,
    message:
      "That division works for me. However, I think we should both review each other's code periodically so we maintain consistency and catch potential issues early.",
  }),
  new Message({
    id: 11,
    ...user1,
    message:
      'Definitely. Peer reviews always improve the quality of our work, and they also help us stay aligned with the overall architecture and coding standards we agreed upon.',
  }),
  new Message({
    id: 12,
    ...user2,
    message:
      'Another thing I noticed is that we did not include a risk management section in the proposal. We should probably outline potential risks and mitigation strategies before presenting it.',
  }),
  new Message({
    id: 13,
    ...user1,
    message:
      "You're absolutely right. Adding a risk assessment will make the proposal look more professional and show that we have thought carefully about potential obstacles and contingency plans.",
  }),
  new Message({
    id: 14,
    ...user2,
    message:
      'We can mention technical risks like API downtime, performance bottlenecks, and security vulnerabilities, as well as non-technical risks such as scope creep or shifting client requirements.',
  }),
  new Message({
    id: 15,
    ...user1,
    message:
      "Great idea. I'll draft a risk management section this afternoon and share it with you for feedback before we finalize the document.",
  }),
  new Message({
    id: 16,
    ...user2,
    message:
      'Perfect. Also, we should think about setting up weekly check-in meetings so we can monitor progress, address blockers, and adjust the plan if necessary.',
  }),
  new Message({
    id: 17,
    ...user1,
    message:
      'Weekly meetings sound good. Maybe every Monday morning? That way we can set priorities for the week and review what was accomplished previously.',
  }),
  new Message({
    id: 18,
    ...user2,
    message:
      'Monday mornings work for me. We should also maintain a shared task board so everything is transparent and we both have visibility into ongoing and upcoming tasks.',
  }),
  new Message({
    id: 19,
    ...user1,
    message:
      "I'll set up a project board today and organize it into columns for backlog, in progress, review, and completed tasks. That structure has worked well for us before.",
  }),
  new Message({
    id: 20,
    ...user2,
    message:
      'Sounds excellent. By the way, have you considered how we will handle deployment? We need a staging environment to test everything before pushing changes to production.',
  }),
  new Message({
    id: 21,
    ...user1,
    message:
      'Yes, I was thinking about using a cloud-based solution where we can easily replicate the production environment. That way we minimize unexpected differences between staging and live systems.',
  }),
  new Message({
    id: 22,
    ...user2,
    message:
      'That approach makes sense. It will also help us automate deployments later, which could significantly reduce human error and make future updates much smoother.',
  }),
  new Message({
    id: 23,
    ...user1,
    message:
      'Automation is definitely something we should prioritize. Even if it takes a bit more time initially, it will save countless hours in the long run and improve reliability.',
  }),
  new Message({
    id: 24,
    ...user2,
    message:
      'I completely agree. Investing in proper infrastructure and automation now will prevent technical debt from piling up and becoming a major obstacle later on.',
  }),
  new Message({
    id: 25,
    ...user1,
    message:
      'Alright, I will revise the proposal with all these updates and send you a new version by the end of the day so we can review it together.',
  }),
  new Message({
    id: 26,
    ...user2,
    message:
      'Thank you. Once we finalize it, we can schedule a presentation with the client and walk them through our approach in detail to ensure everyone is aligned.',
  }),
  new Message({
    id: 27,
    ...user1,
    message:
      'Yes, and during that meeting we should encourage questions and feedback so we can clarify expectations and avoid misunderstandings before the project officially begins.',
  }),
  new Message({
    id: 28,
    ...user2,
    message:
      'Absolutely. Clear communication at the start of a project sets the tone for collaboration and significantly increases the chances of delivering a successful outcome.',
  }),
  new Message({
    id: 29,
    ...user1,
    message:
      "I'm glad we're aligned on this. I feel much more confident about the project now that we've addressed the potential weak spots in the original draft.",
  }),
  new Message({
    id: 30,
    ...user2,
    message:
      "Same here. Collaborating like this always leads to better results. Let's keep this momentum going and make this our best project yet.",
  }),
  new Message({
    id: 31,
    ...user1,
    message:
      "Agreed. I'll start making the updates right away and will notify you as soon as the revised document is ready for review.",
  }),
  new Message({
    id: 32,
    ...user2,
    message:
      'Great, looking forward to reviewing it later today. Thanks for being proactive and open to feedback throughout this discussion.',
  }),
]

export default messages
