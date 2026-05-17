type ProfileAvatarProps = {
  name: string | null;
  email: string | null;
};

const ProfileAvatar = ({ name, email }: ProfileAvatarProps) => {
  const sourceText = name?.trim() || email?.trim() || "User";
  const initial = sourceText.charAt(0).toUpperCase();

  return (
    <span
      aria-hidden="true"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-sm font-semibold text-slate-100"
    >
      {initial}
    </span>
  );
};

export { ProfileAvatar };
export type { ProfileAvatarProps };
