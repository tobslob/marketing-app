import { RoleServ } from "./role";
import { UserRepo, UserDTO } from "@app/data/user";
import { Passwords } from "./password";
import { RoleRepo } from "@app/data/role";
import { Role } from "@app/data/role";
import AdapterInstance from "@app/server/adapter/mail";
import { UnauthorizedError } from "@app/data/util";

class UserService {
  private role: Role;

  async createUser(workspace: string, dto: UserDTO) {
    try {
      this.role = await RoleServ.createRole(
        workspace,
        dto.permissions.loan_admin,
        dto.permissions.super_admin,
        dto.permissions.users
      );
      const generatedPassword = Passwords.generateRandomPassword(10);
      const password = await Passwords.generateHash(generatedPassword);
      const user = await UserRepo.newUser(this.role, workspace, password, dto);

      AdapterInstance.send({
        subject: "Welcome! Supercharge your digital transformation",
        channel: "mail",
        recipient: user.email_address,
        template: "welcome-mail",
        template_vars: {
          firstname: user.first_name,
          emailaddress: user.email_address,
          password: generatedPassword
        }
      });

      return user;
    } catch (err) {
      await RoleRepo.destroy(this.role.id);
    }
  }

  async resetPassword(email: string) {
    const user = await UserRepo.byQuery({ email_address: email }, null, false);

    if (!user) {
      throw new UnauthorizedError("Your email is incorrect.");
    }

    const generatedPassword = Passwords.generateRandomPassword(10);
    const updatedUser = await UserRepo.setPassword(user.id, generatedPassword);

    AdapterInstance.send({
      subject: "Reset Password",
      channel: "mail",
      recipient: user.email_address,
      template: "reset-password-mail",
      template_vars: {
        firstname: user.first_name,
        emailaddress: user.email_address,
        password: generatedPassword
      }
    });

    return updatedUser;
  }

  async editUser(id: string, user: UserDTO) {
    const updatedUser = await UserRepo.atomicUpdate(id, {
      $set: {
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number
      }
    });

    return updatedUser;
  }
}

export const UserServ = new UserService();