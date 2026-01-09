import slugify  from "slugify";
export async function generateUniqueSlug(model, name) {
    let slug = slugify(name, {
        lower: true,
        strict: true
    });

    let existing = await model.findOne({slug});
    let counter = 1;

    while(existing) {
        slug = `${slugify(name, {lower: true, strict: true})}-${counter}`;
        existing = await model.findOne({slug});
        counter++;
    }
    return slug;
}