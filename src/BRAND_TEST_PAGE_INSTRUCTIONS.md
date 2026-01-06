# How to View the Brand Test Page

## 🎨 Quick Access

To view the comprehensive brand design system test page, simply add `?brand-test=true` to your application URL:

### Local Development
```
http://localhost:5173/?brand-test=true
```

### Production
```
https://your-domain.com/?brand-test=true
```

---

## 📋 What You'll See

The brand test page includes comprehensive visual examples of:

### 1. **Color Palettes** (Complete)
- ✅ Terracotta scale (50-700)
- ✅ Forest Green scale (50-700)
- ✅ Neutral scale (0-500)
- ✅ Slate scale (50-700)
- ✅ All with hex codes and usage indicators

### 2. **Typography System**
- ✅ H1-H5 heading hierarchy
- ✅ Body text variations
- ✅ Small and tiny text
- ✅ Font sizes, weights, and colors

### 3. **Button Components**
- ✅ Primary buttons (Terracotta)
- ✅ Secondary buttons (Slate)
- ✅ Success buttons (Forest Green)
- ✅ Destructive buttons (Error)
- ✅ Outline buttons
- ✅ Ghost buttons
- ✅ With icons and disabled states

### 4. **Status Badges**
- ✅ Property statuses (Available, Sold, Pending, Archived)
- ✅ Lead statuses (New, Contacted, Qualified, etc.)
- ✅ Alert badges (Success, Warning, Error, Info)
- ✅ With icons

### 5. **Card Layouts**
- ✅ Property card with image
- ✅ Metric card with trends
- ✅ Info card with list
- ✅ Proper 24px padding

### 6. **Form Components**
- ✅ Text inputs
- ✅ Select dropdowns
- ✅ Number inputs
- ✅ Textareas
- ✅ Checkboxes
- ✅ Proper focus states

### 7. **Table Styling**
- ✅ Header row styling
- ✅ Data rows with hover
- ✅ Status badges in cells
- ✅ Action buttons

### 8. **Spacing Examples**
- ✅ Card padding (24px)
- ✅ Section gaps (32-40px)
- ✅ Element gaps (16-24px)
- ✅ Visual demonstrations

### 9. **60-30-10 Rule**
- ✅ Visual breakdown
- ✅ Color proportion examples
- ✅ Real-world application

---

## 🔍 How to Use

### 1. **Review Colors**
- Check that all color swatches match your brand
- Verify hex codes are correct
- Note which colors are marked as "PRIMARY", "SUCCESS", "BRAND"

### 2. **Test Typography**
- Ensure Inter font is loading correctly
- Check heading hierarchy is clear
- Verify text is readable

### 3. **Interact with Components**
- Hover over buttons to see transitions
- Click inputs to see focus states
- Hover over table rows
- Test form interactions

### 4. **Compare Spacing**
- Look at the spacing examples
- Compare old vs new padding values
- Verify it feels more spacious

### 5. **Check 60-30-10 Ratio**
- Review the visual breakdown
- Understand how colors should be distributed
- Apply this to your designs

---

## ✅ Verification Checklist

Use this to verify the brand system is working correctly:

### Colors
- [ ] Terracotta (#C17052) displays correctly
- [ ] Forest Green (#2D6A54) displays correctly
- [ ] Warm Cream (#E8E2D5) displays correctly
- [ ] Slate colors display correctly
- [ ] All color shades are visible

### Typography
- [ ] Inter font is loading (not system font)
- [ ] Heading sizes are distinct
- [ ] Text colors are slate (not pure black)
- [ ] Font weights are correct (400, 500, 600)

### Components
- [ ] Primary buttons are terracotta
- [ ] Success badges are forest green
- [ ] Cards have white backgrounds with cream borders
- [ ] Inputs have cream backgrounds
- [ ] Focus states show terracotta ring

### Spacing
- [ ] Cards feel more spacious (24px padding)
- [ ] Sections have good breathing room
- [ ] Form fields have adequate spacing
- [ ] Page doesn't feel cramped

### Overall
- [ ] Design feels professional and modern
- [ ] Colors work well together
- [ ] Everything is readable
- [ ] No visual glitches

---

## 🐛 Troubleshooting

### Inter Font Not Loading
**Problem**: Text appears in system font, not Inter  
**Solution**: Check browser console for font loading errors, ensure you have internet connection

### Colors Not Showing
**Problem**: Colors appear as CSS variable names  
**Solution**: Ensure `globals-new.css` is being imported, check browser console for CSS errors

### Page Not Loading
**Problem**: Blank page or error  
**Solution**: Check browser console for JavaScript errors, ensure React is building correctly

### Spacing Looks Wrong
**Problem**: Components are cramped or too spaced out  
**Solution**: Verify you're using the correct Tailwind classes (space-6, p-6, etc.)

---

## 📸 Screenshots

When reviewing with your team, take screenshots of:

1. **Color palettes** - For reference and approval
2. **Button variations** - To ensure consistency
3. **Card examples** - To show spacing improvements
4. **Form components** - To verify accessibility
5. **60-30-10 example** - To demonstrate color ratio

---

## 🚀 Next Steps

After reviewing the test page:

1. **Approve Design** - Get stakeholder sign-off on colors and styling
2. **Replace globals.css** - Swap in the new design system
3. **Update Components** - Follow the Implementation Guide
4. **Test in Real Pages** - Apply to actual application pages
5. **Launch** - Roll out the new brand!

---

## 📚 Related Documentation

- **BRAND_REDESIGN_PLAN.md** - Complete implementation strategy
- **BRAND_QUICK_REFERENCE.md** - Quick color and component reference
- **COLOR_PALETTE_EXTRACTION.md** - Detailed color information
- **IMPLEMENTATION_GUIDE.md** - Step-by-step implementation
- **VISUAL_BRAND_GUIDE.md** - Visual design patterns

---

## 💡 Pro Tips

### For Designers
- Use this page to extract exact hex codes
- Screenshot components for design files
- Reference typography hierarchy
- Note spacing values

### For Developers
- Use this page to verify CSS variables
- Copy component code examples
- Test color contrast
- Verify responsive behavior

### For Stakeholders
- Review overall aesthetic
- Approve color palette
- Verify brand alignment
- Provide feedback

---

## ⚠️ Important Notes

1. **This is a TEST page** - It's for visual review only, not production use
2. **No authentication needed** - The brand test bypasses login
3. **No data storage** - Changes here don't affect your actual application
4. **Temporary URL** - Remove `?brand-test=true` to return to normal app

---

## 📞 Need Help?

If you have questions or need assistance:

1. Check the BRAND_QUICK_REFERENCE.md for quick answers
2. Review the IMPLEMENTATION_GUIDE.md for detailed steps
3. Consult the BRAND_REDESIGN_PLAN.md for strategy
4. Ask your development team for technical support

---

**Happy Brand Testing!** 🎨✨

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Test Page Component**: `/components/test/BrandTestPage.tsx`
