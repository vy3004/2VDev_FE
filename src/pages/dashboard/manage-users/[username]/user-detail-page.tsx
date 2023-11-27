import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import UserDetailForm from "./user-detail-form";
import Loading from "../../../../components/common/loading";
import NotFoundAlert from "../../../../components/common/not-found-alert";

import userService from "../../../../services/user-service";

import { User } from "../../../../utils/types";

const UserDetailPage = () => {
  const { username } = useParams();
  const { t } = useTranslation();

  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);

        if (username) {
          const { response } = await userService.getUser({
            username,
          });

          if (response) {
            setUser(response.data.result);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [username]);

  return loading ? (
    <div className="relative h-96">
      <Loading />
    </div>
  ) : user ? (
    <UserDetailForm user={user} />
  ) : (
    <NotFoundAlert message={t("user.User not found")} type="error" />
  );
};

export default UserDetailPage;
