const trezSmsClient = require("trez-sms-client");

async function smsClient(mobile, otpCode){
    const sender = "5000248725";
    const message = `رمز یکبار مصرف ${otpCode}`
    const client = new trezSmsClient("215Saeed", "2150057239");
    client.sendMessage(sender, mobile, message, otpCode)
    .then((receipt) =>{
        console.log("Receipt: " + receipt);
    })
    .catch((error) => {
        console.log(error.isHttpException, error.code, error.message);
    })
}

module.exports = {
    smsClient
}

