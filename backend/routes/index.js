var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");
const Form = require("../models/form");
const User = require("../models/user");
const sessionChecker = require('../middleware/auth');

router.post("/api/newForm", async (req, res, next) => {
    const user1 = req.session.user;
    const user1Form = await Form.findOne({idAuthor: user1._id});
    if (user1Form) {
        const {metro, interest, budget, about} = req.body;
        user1Form.location = metro;
        user1Form.interest = interest;
        user1Form.data = new Date();
        user1Form.about = about;
        user1Form.prise = budget;
        user1Form.save();
        res.json({text: "Анкета обновлена!"});
    } else {
    const {metro, interest, budget, about} = req.body;

    const form = new Form({
        idAuthor: req.session.user._id,
        location: metro,
        interest,
        data: new Date(),
        about,
        likes: [],
        funs: [],
        prise: budget
    });
    try {
        await form.save();
        res.send("form is save");
    } catch (e) {
        res.send("form is NO save");
    }
    res.send("ok");
}
});

router.route("/api/sendLikeMail").post(async (req, res, next) => {
    try {
        const user1 = req.session.user;
        const user2ID = req.body;

        const user1Form = await Form.findOne({idAuthor: user1._id});
        const user2Form = await Form.findOne({idAuthor: user2ID.id });

        if (user2Form.funs.includes(user1Form.idAuthor) || user2Form.сomparison.includes(user1Form.idAuthor) ) {

            res.json({text:"Вы уже стаивли лайк данному пользователю, передите в профиль!"});
        } else {
            if (user2Form.likes.includes(user1Form.idAuthor)) {
                async function main() {
                    let testAccount = await nodemailer.createTestAccount();
                    const transporter = nodemailer.createTransport({
                        host: "smtp.yandex.ru",
                        port: 465,
                        secure: true,
                        auth: {
                            user: "pekarnyavkusnaya",
                            pass: "pekarnyavkusnaya111"
                        }
                    });

                    let info = await transporter.sendMail({
                        from: '"Roomroom 👻" <pekarnyavkusnaya@yandex.ru>', // sender address
                        to: `igordg@mail.ru`,  // list of receivers  user2.email,
                        subject: "Roomroom ✔", // Subject line
                        text: "Текст1", // plain text body
                        html:
                            `<img src="https://gorod.tomsk.ru/uploads/33808/1240896561/my_room.jpg" alt="RoomRoom"><br>
                            <b>Здравствуйте! На сервисе RoomRoom появился пользователь, который хотел бы вместе с Вами арендовать квартиру!</b>
                                <p>Имя пользователя: ${user1.first_name} ${user1.last_name}</p>
                                <p>Более подробная информация в Вашем профиле RoomRoom в разделе "Совпадания"</p> `
                    });
                    console.log("Message sent: %s", info.messageId);
                    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                    res.send("Письмо отправлено!");
                }
                main().catch(console.error);

                user1Form.likes.push(user2Form.idAuthor);
                user1Form.сomparison.push(user2Form.idAuthor);
                user2Form.сomparison.push(user1Form.idAuthor);
                // user2Form.funs.push(user1Form.idAuthor)
                for (let i = 0; i < user1Form.funs.length ; i++) {
                    if(user1Form.funs[i] === user2Form.idAuthor){
                        user1Form.funs.splice(i, 1)
                        break;
                    }
                }

                user1Form.save();
                user2Form.save();
                res.json({text: "Совпадение! Данный пользователь также хотел бы с Вами снимать картиру!"});
            } else {
                async function main() {
                    let testAccount = await nodemailer.createTestAccount();
                    const transporter = nodemailer.createTransport({
                        host: "smtp.yandex.ru",
                        port: 465,
                        secure: true,
                        auth: {
                            user: "pekarnyavkusnaya",
                            pass: "pekarnyavkusnaya111"
                        }
                    });

                    let info = await transporter.sendMail({
                        from: '"Roomroom 👻" <pekarnyavkusnaya@yandex.ru>', // sender address
                        to: `igordg@mail.ru`,  // list of receivers  user2.email,
                        subject: "Roomroom ✔", // Subject line
                        text: "Текст1", // plain text body
                        html:
                            `<img src="https://gorod.tomsk.ru/uploads/33808/1240896561/my_room.jpg" alt="RoomRoom"><br>
                            <b>Здравствуйте! На сервисе RoomRoom у Вас появились новые лайки!</b>
                                <p>Лайк поставлен пользователем ${user1.first_name} ${user1.last_name}</p>
                                <p>Более подробная информация в Вашем профиле RoomRoom</p>`
                    });
                    console.log("Message sent: %s", info.messageId);
                    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                    res.send("Письмо отправлено!");
                }
                main().catch(console.error);
                user1Form.likes.push(user2Form.idAuthor);
                user2Form.funs.push(user1Form.idAuthor)
                user1Form.save();
                user2Form.save();
                res.json({text: "Пользователю, которому Вы поставили лайк направлено уведомление о том, что Вы хотели бы совместно снимать квартиру!"})
            }
        }
  } catch (error) {
    next(error);
  }
});

router.post("/api/findSimilarUsers", sessionChecker, async (req, res, next) => {
  try {
    let user = req.session.user;
    const userForm = await Form.findOne({ idAuthor: user._id });
    if(userForm) {
        let arr1 = userForm;
        let arr2 = [];
        let arr3 = await Form.find();
        for (let i = 0; i < arr3.length; i++) {
            if (arr1.location === arr3[i].location) {
                arr2.push(arr3[i]);
            }
        }
        let allComparison = [];

        arr2.map(function (e) {
            let сomparison = [];
            let userId = {idAuthor: e.idAuthor};
            let location = {location: e.location};
            let data = {data: e.data};
            let about = {about: e.about};
            let likes = {likes: e.likes};
            let prise = {prise: e.prise};

            сomparison.push(userId);
            сomparison.push(location);
            сomparison.push(data);
            сomparison.push(about);
            сomparison.push(likes);
            сomparison.push(prise);

            let arrInterests = [];
            for (let i = 0; i < arr1.interest.length; i++) {
                for (let k = 0; k < e.interest.length; k++) {
                    if (arr1.interest[i] == e.interest[k]) {
                        arrInterests.push(arr1.interest[i]);
                    }
                }
            }

            сomparison.push(arrInterests);
            allComparison.push(сomparison);
        });
        // for (let i = 0; i < allComparison.length; i++) {
        //     console.log(arr1.interest, allComparison[i][6])
        // }
        let lengthAllComparison = [];
        for (let i = 20; i >= 0; i--) {
            for (let j = 0; j < allComparison.length; j++) {
                if (allComparison[j][6].length === i) {
                    lengthAllComparison.push(allComparison[j]);
                }
            }
        }

        let finishREsult = [];

        for (let i = 0; i < lengthAllComparison.length; i++) {
            if (lengthAllComparison[i][6].length !== 0) {
                finishREsult.push(lengthAllComparison[i]);
            }
        }
// for (let i = 0; i < finishREsult.length; i++) {
//             console.log(arr1.interest, finishREsult[i][6])
//         }
        sortUserPrise = [];
        for (let i = 0; i < finishREsult.length; i++) {
            if (finishREsult[i][5].prise <= (arr1.prise + 5)) {
                sortUserPrise.push(finishREsult[i]);
            }
        }
        // for (let i = 0; i < finishREsult.length; i++) {
        //     console.log(arr1.interest, finishREsult[i][6])
        // }
        let arrSortUserId = [];
        for (let i = 0; i < sortUserPrise.length; i++) {
            arrSortUserId.push(sortUserPrise[i][0].idAuthor)
        }

        // for (let i = 0; i < sortUserPrise.length; i++) {
        //     console.log(arr1.interest, sortUserPrise[i][6])
        // }
        const baseSortFormsId = await Form.find({idAuthor: arrSortUserId});
        const baseSortUsersId = await User.find({_id: arrSortUserId});

        let gradationUsers = [];
        let gradationForms = [];

        for (let i = 0; i < arrSortUserId.length; i++) {
            for (let k = 0; k < baseSortUsersId.length; k++) {
                if (arrSortUserId[i] === baseSortUsersId[k].id) {
                    gradationUsers.push(baseSortUsersId[k]);

                }
            }
        }

        for (let i = 0; i < arrSortUserId.length; i++) {
            for (let k = 0; k < baseSortFormsId.length; k++) {
                if (arrSortUserId[i] === baseSortFormsId[k].idAuthor) {
                    gradationForms.push(baseSortFormsId[k]);

                }
            }
        }

        console.log(arrSortUserId.length, baseSortFormsId.length, baseSortUsersId.length)

        // for (let i = 0; i < baseSortFormsId.length; i++) {
        //         console.log(arrSortUserId[i], baseSortFormsId[i].id)
        //     }

        // for (let i = 0; i < baseSortUsersId.length; i++) {
        //     console.log(arr1.interest, gradationForms[i].interest, sortUserPrise[i][6])
        // }

        let frontViewArr = [];
        for (let i = 0; i < gradationUsers.length; i++) {
            let obj = {
                id: "",
                location: "",
                interest: "",
                about: "",
                prise: "",
                first_name: "",
                age: '',
                nativeLocation: '',
                photo: "",
                сomparisonInterests: ''
            };
            (obj.id = arrSortUserId[i]), (obj.location = gradationForms[i].location);
            obj.interest = gradationForms[i].interest;
            obj.about = gradationForms[i].about;
            obj.prise = gradationForms[i].prise;
            obj.first_name = gradationUsers[i].first_name;

            if(gradationUsers[i].age){
                obj.age = gradationUsers[i].age
            }else{
                obj.age = null;
            }
            if(gradationUsers[i].nativeLocation){
                obj.nativeLocation = gradationUsers[i].nativeLocation
            }else{
                obj.nativeLocation = '';
            }
            obj.photo = gradationUsers[i].photo;
            obj.сomparisonInterests = sortUserPrise[i][6];
            frontViewArr.push(obj);
        }

        let arrWhithoutOwnUserId = [];
        for (let i = 0; i < frontViewArr.length; i++) {
            if(frontViewArr[i].id !== user._id){
                arrWhithoutOwnUserId.push(frontViewArr[i])
            }
        }
        res.json(arrWhithoutOwnUserId);
    }else{
        res.json({error: 'Анкета отсутствует, создайте анкету!'});
    }
  } catch (error) {
    next(error);
  }
});

router.get("/api/likes/by", async (req, res) => {
  try {
    const { _id } = req.session.user;
    const form = await Form.findOne({ idAuthor: _id });
    if (!form) {
      res.status(200).json({ response: "noform" });
    } else {
      const users = await User.find({ _id: form.funs });
      const userIDs = users.map(user => {
        return user._id;
      });
      const forms = await Form.find({ idAuthor: userIDs });
      const formsUsers = [];
      for (let i = 0; i < forms.length; i++) {
        formsUsers.push({
          form: forms[i],
          id: users[i]._id,
          first_name: users[i].first_name,
          last_name: users[i].last_name,
          photo: users[i].photo,
          age: users[i].age,
          nativeLocation: users[i].nativeLocation,
        });
      }
      res.status(200).json({ response: formsUsers });
    }
  } catch (e) {
    res.status(400).json({ response: "fail" });
  }
});

router.get("/api/likes/mutual", async (req, res) => {
  try {
    const { _id } = req.session.user;
    const form = await Form.findOne({ idAuthor: _id });
    if (!form) {
      res.status(200).json({ response: "noform" });
    } else {
      const match = form["сomparison"];
      if (match.length !== 0) {
        const users = await User.find({ _id: match });
        const userIDs = users.map(user => {
          return user._id;
        });
        const forms = await Form.find({ idAuthor: userIDs });
        const formsUsers = [];
        for (let i = 0; i < forms.length; i++) {
          formsUsers.push({
            form: forms[i],
            id: users[i]._id,
            first_name: users[i].first_name,
            last_name: users[i].last_name,
            email: users[i].email,
            phone: users[i].phone,
            vk: users[i].vk,
            age: users[i].age,
            nativeLocation: users[i].nativeLocation,
            photo: users[i].photo
          });
        }
        res.status(200).json({ response: formsUsers });
      } else {
        res.status(200).json({ response: "nomatch" });
      }
    }
  } catch (e) {
    res.status(400).json({ response: "fail" });
  }
});

module.exports = router;
