const { query } = require('../../utilities/query');



class User {
    constructor(userid, password) { // Password should be hashed
        this.info = false; // Holder
        this.userid = userid;
        this.password = password;
    }

    async intializeInfo() {
        let result = await query(
            `
            SELECT customerId, firstName, lastName, email, phonenum, address, city, state, postalCode, country
            FROM customer
            WHERE userid = @userid AND password = @password`,
            {
                userid: this.userid,
                password: this.password
            }
        );
        // Duplicate credentials are not allowed. This should be handled at registering step.
        if (result.recordset.length > 1) {
            console.log("Duplicate credential in database");
        } else if (result.recordset.length < 1) {

            throw new Error("Invalid intialization of a user!");
        }

        let userInfo = result.recordset[0];
        this.info = {
            customerId: userInfo.customerId,
            userid: this.userid,
            password: this.password,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            phonenum: userInfo.phonenum,
            address: userInfo.address,
            city: userInfo.city,
            state: userInfo.state,
            postalCode: userInfo.postalCode,
            country: userInfo.country
        };
        return this;
    }
}


class Admin {
    constructor(userid, password) {
        this.info = false;
        this.userid = userid;
        this.password = password;
    }

    async intializeInfo() {
        console.log(this);
        let result = await query(
            `
            SELECT adminId, firstName, lastName, email, phonenum
            FROM admin
            WHERE userid = @userid AND password = @password`,
            {
                userid: this.userid,
                password: this.password
            }
        );

        console.log(result);
        // Duplicate credentials are not allowed. This should be handled at registering step.
        if (result.recordset.length > 1) {
            console.log("Duplicate credential in database");
        } else if (result.recordset.length < 1) {
            throw new Error("Invalid intialization of a user!");
        }

        let userInfo = result.recordset[0];
        this.info = {
            adminId: userInfo.adminId,
            userid: this.userid,
            password: this.password,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            phonenum: userInfo.phonenum,
            isAdmin: true
        };
        return this;
    }

}


module.exports = { User, Admin };

