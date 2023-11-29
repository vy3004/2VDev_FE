import { useTranslation } from "react-i18next";

import { Typography, Avatar, Spinner } from "@material-tailwind/react";

interface TypingCommentProps {
  user?: any;
}

const TypingComment: React.FC<TypingCommentProps> = ({ user }) => {
  const { t } = useTranslation();

  if (!user) {
    user = {
      name: "OpenAI",
      avatar:
        "https://cdn.vox-cdn.com/thumbor/VUn58Srehbu5brDicV6QgNp8SM0=/0x0:1820x1213/1400x1400/filters:focal(910x607:911x608)/cdn.vox-cdn.com/uploads/chorus_asset/file/24247717/lp_logo_3.0.jpg",
    };
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar
        src={user.avatar}
        size="sm"
        alt="avatar"
        withBorder={true}
        className="p-[1px] dark:border-gray-300"
      />
      <div className="space-y-2 border rounded-lg w-full min-w-0 p-2 dark:bg-gray-900 dark:border-gray-900">
        <div className="flex items-center justify-between gap-2 text-gray-900 dark:text-gray-300">
          <Typography className="font-bold">
            <span className="text-blue-500">{user.name}</span>{" "}
            {t("post.is typing ...")}
          </Typography>
          <Spinner className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default TypingComment;
