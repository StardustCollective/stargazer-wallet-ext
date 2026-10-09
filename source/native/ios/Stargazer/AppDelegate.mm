#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTBridgeModule.h>

static NSInteger const kPrivacyCoverTag = 7310;
// Longest the cover waits for JS to lock the wallet before it is removed anyway
static NSTimeInterval const kPrivacyCoverLockFallback = 2.0;

// Set from JS while a wallet is unlocked (0 otherwise). When the app returns after this long
// in background, the cover stays up until JS has locked, so the unlocked wallet never shows.
static NSTimeInterval sLockTimeout = 0;
static NSDate *sBackgroundedAt = nil;
static NSUInteger sPrivacyCoverGeneration = 0;

static void HidePrivacyCover(void)
{
  UIWindow *window = UIApplication.sharedApplication.delegate.window;
  [[window viewWithTag:kPrivacyCoverTag] removeFromSuperview];
}

@interface PrivacyCover : NSObject <RCTBridgeModule>
@end

@implementation PrivacyCover

RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(setLockTimeout:(double)milliseconds)
{
  sLockTimeout = milliseconds / 1000.0;
}

RCT_EXPORT_METHOD(hide)
{
  HidePrivacyCover();
}

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"Stargazer";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  // Notifications are posted for both app and scene based lifecycles
  NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
  [center addObserver:self
             selector:@selector(showPrivacyCover)
                 name:UIApplicationWillResignActiveNotification
               object:nil];
  [center addObserver:self
             selector:@selector(didEnterBackground)
                 name:UIApplicationDidEnterBackgroundNotification
               object:nil];
  [center addObserver:self
             selector:@selector(didBecomeActive)
                 name:UIApplicationDidBecomeActiveNotification
               object:nil];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// Hide wallet content such as seed phrases from the app switcher snapshot
- (void)showPrivacyCover
{
  sPrivacyCoverGeneration++;
  if (self.window == nil || [self.window viewWithTag:kPrivacyCoverTag] != nil) {
    return;
  }

  UIVisualEffectView *cover =
      [[UIVisualEffectView alloc] initWithEffect:[UIBlurEffect effectWithStyle:UIBlurEffectStyleDark]];
  cover.frame = self.window.bounds;
  cover.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
  cover.tag = kPrivacyCoverTag;
  [self.window addSubview:cover];
}

- (void)didEnterBackground
{
  sBackgroundedAt = [NSDate date];
}

- (void)didBecomeActive
{
  BOOL lockDue = sLockTimeout > 0 && sBackgroundedAt != nil &&
      -[sBackgroundedAt timeIntervalSinceNow] >= sLockTimeout;
  sBackgroundedAt = nil;

  if (!lockDue) {
    HidePrivacyCover();
    return;
  }

  // JS removes the cover once it has locked; this is only a fallback
  NSUInteger generation = sPrivacyCoverGeneration;
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(kPrivacyCoverLockFallback * NSEC_PER_SEC)),
                 dispatch_get_main_queue(), ^{
                   if (generation == sPrivacyCoverGeneration) {
                     HidePrivacyCover();
                   }
                 });
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end