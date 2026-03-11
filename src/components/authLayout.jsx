import ShinyText from "./ShinyText";

const baseInputClassName =
  "w-full h-[50px] rounded-xl border border-white/40 bg-white/70 px-4 text-center text-gray-900 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] dark:border-gray-700/60 dark:bg-gray-900/70 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-[#a855f7]";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  panelWidthClassName = "lg:w-[40%]",
}) {
  return (
    <div className="w-full min-h-screen bg-[url('/login-bg.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="min-h-screen bg-white/10 dark:bg-black/40">
        <div className="mx-auto flex min-h-screen w-full max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
          <div className="hidden w-[60%] lg:block"></div>

          <div
            className={`flex w-full items-start justify-center lg:items-center ${panelWidthClassName}`}
          >
            <div className="flex min-h-[680px] w-full max-w-md flex-col justify-center rounded-3xl border border-white/40 bg-white/20 p-8 text-gray-900 shadow-2xl backdrop-blur-xl sm:p-10 dark:border-gray-700/60 dark:bg-gray-900/60 dark:text-white">
              <h2 className="mb-2 text-center text-3xl font-black sm:text-4xl">
                <ShinyText
                  text={title}
                  speed={2.5}
                  delay={0}
                  color="var(--auth-title-color)"
                  shineColor="var(--auth-title-shine)"
                  spread={120}
                  direction="right"
                  yoyo
                  pauseOnHover
                  disabled={false}
                />
              </h2>

              <p className="mb-8 text-center text-sm font-medium text-gray-800 sm:text-base dark:text-gray-200">
                {subtitle}
              </p>

              {children}

              {footer && (
                <div className="mt-8 text-center text-sm font-medium text-gray-900 sm:text-base dark:text-gray-200">
                  {footer}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthInput({ type = "text", className = "", ...props }) {
  const passwordClassName =
    type === "password" ? " tracking-[0.3em]" : "";

  return (
    <input
      type={type}
      className={`${baseInputClassName}${passwordClassName} ${className}`.trim()}
      {...props}
    />
  );
}

export function AuthButton({
  children,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`flex h-[50px] w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#a855f7] font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-[#4338ca] hover:to-[#9333ea] active:scale-[0.98] disabled:opacity-70 disabled:hover:translate-y-0 dark:from-[#7c3aed] dark:to-[#f59e0b] dark:hover:from-[#6d28d9] dark:hover:to-[#f59e0b] ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export function AuthDivider({ label = "Or" }) {
  return (
    <div className="my-2 flex items-center">
      <div className="flex-1 border-t border-gray-400 dark:border-gray-600"></div>
      <span className="px-4 text-xs font-bold uppercase text-gray-800 dark:text-gray-200">
        {label}
      </span>
      <div className="flex-1 border-t border-gray-400 dark:border-gray-600"></div>
    </div>
  );
}
