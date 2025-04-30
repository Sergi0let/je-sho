const Checkicon = ({ className }: { className?: string }) => {
  return (
    <svg
      fill="none"
      className={className}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#a)">
        <path
          d="M2.6 2.648c-2.95 2.98-2.933 7.804.048 10.752 2.98 2.95 7.804 2.933 10.752-.048 2.95-2.98 2.933-7.804-.048-10.752C10.372-.35 5.548-.333 2.6 2.648zm9.102 3.894l-4.135 4.182a.91.91 0 01-1.282 0l-.16-.16-.48-.48-1.347-1.33a.91.91 0 010-1.283.91.91 0 011.282 0l1.346 1.33 3.494-3.525a.91.91 0 011.282 0 .89.89 0 010 1.266z"
          fill="#14B356"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path d="M0 0h16v16H0z" fill="#fff" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Checkicon;
