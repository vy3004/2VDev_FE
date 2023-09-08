import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button, Typography } from "@material-tailwind/react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import UserDetailForm from "./user-detail-form";
import Loading from "../../../../components/common/loading";

import userService from "../../../../services/user-service";

import { User } from "../../../../utils/types";

const UserDetailPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  return loading ? (
    <Loading />
  ) : user ? (
    <UserDetailForm user={user} />
  ) : (
    <div className="flex items-center justify-between rounded-lg p-4 bg-red-100 text-red-500">
      <div className="flex space-x-4">
        <div>
          <ExclamationCircleIcon className="h-6 w-6" />
        </div>
        <Typography className="font-bold">User not found!</Typography>
      </div>
      <Button onClick={() => navigate(-1)} color="red" size="sm">
        Back
      </Button>
    </div>
  );
};

export default UserDetailPage;
