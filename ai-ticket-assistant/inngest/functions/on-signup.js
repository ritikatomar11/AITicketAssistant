import { inngest } from "../client.js";
import User from "../../models/user.js"
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";

export const onUserSignup = inngest.createFunction(
    {id:"on-user-signup" , retries:2} , 
    {event:"user/signup"} , 
    async ({event , step})=>{
        try{
            const {email}  = event.data
            //pipeline one
            const user = await step.run("get-user-email" , async()=>{
                const userObject = await User.findOne({email}); 
                if(!userObject){
                    throw new NonRetriableError("user no longer exist in db")
                }
                return userObject; 
            })
            // pipeline 2
            await step.run("send-welcome-email" , async()=>{
                const subject = `Welcome to the AIticketAssistant`
                const message = `Hi,
                \n\n
                Thanks for signing up , we're glad to have you onboard!`

                await sendMail(user.email , subject , message);

            })
            //when all of this is done and run
            return { success:true }
        }catch(error){
            console.error('❌Error running step' , error.message)
            return {success:false}
        }
    }
)