import { Admin, AppUser, Person, Story, Chapter, StoryAccess } from '../models/index.js';
import { validateDailyStoryAccess } from '../services/story_validation.service.js';
import { sendEmail } from '../services/email.service.js';

export async function requestDailyChapter(req, res){
    const userId = req.user.id;
    const valid = await validateDailyStoryAccess(userId);
    if(!valid) return res.status(403).json({ message: 'You do not meet the daily requirements' });
    const story = await Story.findOne({ where: { active: 1 } });
    if(!story) return res.status(404).json({ message: 'No active story' });
    const day = new Date().getDate();
    const chapter = await Chapter.findOne({ where: { storyId: story.id, dayNumber: day } });
    if(!chapter) return res.status(404).json({ message: 'Chapter not available' });
    const existing = await StoryAccess.findOne({ where: { userId, storyId: story.id } });
    if(existing) return res.status(400).json({ message: 'Application already sent' });
    const admins = await Admin.findAll();
    admins.forEach(async(admin)=>{
        const people = await Person.findAll({ where: { id: admin.personId } });
        people.forEach(async(person)=>{
            const emails = [];
            emails.push(person.email);
            const user = await AppUser.findOne({ where: { personId: userId } });
            const person = await Person.findOne({ where: { id: user.personId } });
            emails.forEach(async(email)=>{
                await sendEmail(
                    email,
                    'Solicitud de revisión de capítulo',
                    `El usuario ${person.nickname} ha solicitado acceso al capítulo ${day}`,
                    `<a href="${process.env.FRONT_URL}/admin/login">Ir al login</a>`
                );
            });
        });
    });
    return res.json({ message: 'Application sent for review' });
}