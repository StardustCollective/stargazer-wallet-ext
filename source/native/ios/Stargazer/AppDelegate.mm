#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

static NSInteger const kPrivacyCoverTag = 7310;

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
             selector:@selector(hidePrivacyCover)
                 name:UIApplicationDidBecomeActiveNotification
               object:nil];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// Hide wallet content such as seed phrases from the app switcher snapshot
- (void)showPrivacyCover
{
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

- (void)hidePrivacyCover
{
  [[self.window viewWithTag:kPrivacyCoverTag] removeFromSuperview];
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